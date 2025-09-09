const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const { Account, User, Transaction } = require("../db");
const bcrypt = require("bcrypt");
const z = require("zod");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res, next) => {
  try {
    const account = await Account.findOne({
      userId: req.userId
    }).lean();
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }
    
    res.json({
      success: true,
      balance: account.balance
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    next(error);
  }
});

router.get("/transactions", authMiddleware, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({
      $or: [
        { from: req.userId },
        { to: req.userId }
      ]
    })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate('from to', 'firstName lastName username')
    .lean();

    res.json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        hasMore: transactions.length === limit
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    next(error);
  }
});

router.post("/transfer", authMiddleware, async (req, res, next) => {
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();
    
    const transferSchema = z.object({
      to: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid recipient ID"
      }),
      amount: z.number().positive("Amount must be positive")
    });

    const validatedData = transferSchema.parse({
      to: req.body.to,
      amount: parseFloat(req.body.amount)
    });
    
    if (validatedData.to === req.userId.toString()) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Cannot transfer to yourself"
      });
    }
    
    const senderAccount = await Account.findOne({ userId: req.userId }).session(session);
    if (!senderAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Sender account not found"
      });
    }

    if (senderAccount.balance < validatedData.amount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Insufficient balance"
      });
    }
    
    const recipientAccount = await Account.findOne({ userId: validatedData.to }).session(session);
    if (!recipientAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Recipient account not found"
      });
    }
    
    // Update balances
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -validatedData.amount } }
    ).session(session);
    
    await Account.updateOne(
      { userId: validatedData.to },
      { $inc: { balance: validatedData.amount } }
    ).session(session);

    // Create transaction record
    const [transaction] = await Transaction.create([{
      from: req.userId,
      to: validatedData.to,
      amount: validatedData.amount,
      timestamp: new Date()
    }], { session });

    await session.commitTransaction();
    
    // Populate the transaction with user details
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('from to', 'firstName lastName username')
      .lean();
    
    res.json({
      success: true,
      message: "Transfer successful",
      data: populatedTransaction
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Transfer error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: error.errors
      });
    }
    
    next(error);
  } finally {
    await session.endSession();
  }
});

module.exports = router;
