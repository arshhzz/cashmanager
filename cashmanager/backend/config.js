require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-fallback-secret-key',
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 3000,
  BCRYPT_ROUNDS: 12
};
