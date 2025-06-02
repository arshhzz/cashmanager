const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const { Account, User } = require("../db");

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
    next(error);
  }
});

router.post("/transfer", authMiddleware, async (req, res, next) => {
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();
    
    const { amount, to } = req.body;
    
    if (!amount || amount <= 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Invalid amount"
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(to)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Invalid recipient ID"
      });
    }
    
    if (to === req.userId.toString()) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Cannot transfer to yourself"
      });
    }
    
    const senderAccount = await Account.findOne({ userId: req.userId }).session(session);
    if (!senderAccount || senderAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Insufficient balance"
      });
    }
    
    const recipientAccount = await Account.findOne({ userId: to }).session(session);
    if (!recipientAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Recipient account not found"
      });
    }
    
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);
    
    await session.commitTransaction();
    
    res.json({
      success: true,
      message: "Transfer successful",
      data: {
        amount,
        from: req.userId,
        to,
        timestamp: new Date()
      }
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
});

module.exports = router;
