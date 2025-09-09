const mongoose = require('mongoose');
const { MONGODB_URL } = require('../config');
const logger = require('../utils/logger');

// --- Connect to MongoDB ---
const connectDB = async () => {
  try {
    if (!MONGODB_URL) {
      throw new Error('MongoDB URL is not defined');
    }

    logger.info('Attempting to connect to MongoDB Atlas...');

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      retryReads: true,
      w: 'majority'
    };

    await mongoose.connect(MONGODB_URL, options);
    logger.info('MongoDB Atlas connected successfully');

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('MongoDB connection error:', error);
    setTimeout(connectDB, 5000); // retry
  }
};

// --- User Schema ---
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: { type: String, required: true, minLength: 6 },
  firstName: { type: String, required: true, trim: true, maxLength: 50 },
  lastName: { type: String, required: true, trim: true, maxLength: 50 }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.index({ username: 1 });
userSchema.index({ firstName: 1, lastName: 1 });

// --- Account Schema ---
const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, required: true, min: 0, default: 0 }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

accountSchema.index({ userId: 1 });

// --- Transaction Schema ---
const transactionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 1 },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// --- Models ---
const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// --- Exports ---
module.exports = {
  connectDB,
  User,
  Account,
  Transaction
};
