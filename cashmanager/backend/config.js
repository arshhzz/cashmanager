require('dotenv').config();

const config = {
  PORT: process.env.PORT || 3000,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/cashmanager',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  FRONTEND_URLS: [
    "http://localhost:5173",
    "https://cashmanager-1.onrender.com"
  ]
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('Warning: Missing required environment variables:', missingEnvVars);
}

module.exports = config;
