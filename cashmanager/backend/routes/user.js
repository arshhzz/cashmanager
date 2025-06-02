const express = require("express"); 
const z = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET, BCRYPT_ROUNDS } = require("../config");
const { Account, User } = require("../db");
const { authMiddleware } = require("../middleware");

const userrouter = express.Router();

const signupSchema = z.object({
  username: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50)
});

const signinSchema = z.object({
  username: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

const updateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  password: z.string().min(6).optional()
});

userrouter.post("/signup", async (req, res, next) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    
    const existingUser = await User.findOne({
      username: validatedData.username
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, BCRYPT_ROUNDS);
    
    const user = await User.create({
      username: validatedData.username,
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName
    });

    await Account.create({
      userId: user._id, 
      balance: Math.floor(1 + Math.random() * 10000)
    });

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: error.errors
      });
    }
    next(error);
  }
});

userrouter.post("/signin", async (req, res, next) => {
  try {
    const validatedData = signinSchema.parse(req.body);
    
    const user = await User.findOne({
      username: validatedData.username
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: error.errors
      });
    }
    next(error);
  }
});

userrouter.put("/", authMiddleware, async (req, res, next) => {
  try {
    const validatedData = updateSchema.parse(req.body);
    
    if (validatedData.password) {
      validatedData.password = await bcrypt.hash(validatedData.password, BCRYPT_ROUNDS);
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      validatedData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: error.errors
      });
    }
    next(error);
  }
});

userrouter.get("/bulk", authMiddleware, async (req, res, next) => {
  try {
    const filter = req.query.filter || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [
            { firstName: { $regex: filter, $options: 'i' } },
            { lastName: { $regex: filter, $options: 'i' } }
          ]
        }
      ]
    })
    .select('username firstName lastName _id')
    .limit(limit)
    .skip(skip)
    .lean();
    
    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        hasMore: users.length === limit
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = userrouter;
