const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://arshdeepkhalsa60:faBN1QkySO9JqghA@paytm.p9rjdvc.mongodb.net/users");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
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
});

const accountsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, 
  balance: {
    type: Number,
    required: true
  }
});

const User = mongoose.model("User", userSchema)
const Account = mongoose.model("Account", accountsSchema)
module.exports = {
  User,
  Account
};