const mongoose = require('mongoose');
const { MONGODB_URI } = require('./config');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  }
}, { timestamps: true });

const accountsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }, 
  balance: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

userSchema.index({ username: 1 });
userSchema.index({ firstName: 1, lastName: 1 });
accountsSchema.index({ userId: 1 });

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountsSchema);

module.exports = {
  User,
  Account
};