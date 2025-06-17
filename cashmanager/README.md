# 💸 CashManager – Digital Wallet Application

CashManager is a secure, full-stack digital wallet application that enables users to register, manage their accounts, and perform real-time money transfers. Designed using modern web technologies and security-first architecture, this project demonstrates robust authentication, API validation, and testing workflows.

---

## 🚀 Features

### 👤 User Management
- Secure JWT-based registration and login
- Profile management with user info update
- Zod schema validation for email & inputs
- Password hashing with bcrypt + salting

### 💼 Account Management
- Auto-provisioned digital wallet per user
- Real-time balance inquiry
- Randomized initial balance (₹1 – ₹10,000)

### 💸 Money Transfers
- Peer-to-peer money transfers with auth
- ACID-compliant transactions
- Balance checks and error handling
- Invalid/insufficient transaction protection

---

## 🔐 Security Highlights
- JWT authentication & authorization
- Bcrypt for encrypted password storage
- Zod input schema enforcement
- Rate limiting for sensitive endpoints
- CORS protection and HTTP headers via Helmet

---

## 🧪 Testing & CI/CD
- **Jest** unit tests for middleware & logic
- Mocked JWT and in-memory MongoDB
- GitHub Actions for CI/CD automation
- Test coverage enforcement (80%+ target)

---

## 🛠️ Tech Stack

### 🔹 Backend
- Node.js, Express.js
- MongoDB + Mongoose
- JWT, Bcrypt, Zod, Helmet, CORS, Express-Rate-Limit
- Jest for testing

### 🔹 Frontend
- React.js + Vite
- React Router, Context API
- Tailwind CSS, Axios, ESLint

---