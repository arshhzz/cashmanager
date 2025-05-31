const express = require("express"); 
const z = require("zod");
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config");
const { Account, User } = require("../db");

const userrouter = express.Router();

const signupbody = z.object ({
  username: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string()
});

const signinbody = z.object({
  username: z.string().min(6),
  password: z.string()
});

userrouter.post("/signup", async(req, res) => {
  const { success } = signupbody.safeParse(req.body);
  if(!success) {
    return res.status(411).json({
      message: "Email already taken / incorrect inputs"
    })
  }
  const existingUser = await User.findOne({
    username: req.body.username
  }) 
  if(existingUser) {
    return res.status(411).json({
      message: "User already exists."
    })
  }
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });
  const userId = user._id;

  await Account.create({
    userId, 
    balance: 1 + Math.random() * 10000
  })

  const token = jwt.sign ({
    userId
  }, JWT_SECRET);

  res.json({
    message: "User Created Successfully",
    token: token
  });
});

userrouter.post("/signin", async(req, res) => {
  const {success} = signinbody.safeParse(req.body);
  if(!success) {
    return req.status(411).json( {
      message : "Invalid inputs"
    });
  }

  const doesExist = await User.findOne({
    username: req.body.username,
    password: req.body.password
  });

  if(doesExist) {
    const token = jwt.sign({
      userId: user._id
    }, JWT_SECRET);

    res.json({
      token: token
    })
    return;
  }

  res.status(411).json({
    message: "Error while logging in"
  })

});
const changingSchema = z.object({
  firstName: z.string().optional(),
  password: z.string().optional(),
  lastName: z.string().optional()
})
userrouter.put("/", async(req, res) => {
  const {success} = changingSchema.safeParse(req.body());
  if(!success) {
    return res.status(411).json( {
      message: "Cant update credentials as there are some invalid inputs"
    });
  }
  await User.updateOne ({
    _id: req.userId
  }, req.body);
  res.json({
    message: "Updated successfully"
  });
});


userrouter.get("/bulk", async(req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [{
      firstName : {
        "$regex": filter
      }
    },{
      lastName: {
        "$regex": filter
      }
    }]
  })
  res.json({
    user: users.map(user => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id
    }))
  })
})

module.exports = userrouter;  
