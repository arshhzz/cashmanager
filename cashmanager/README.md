
# CASHMANAGER
## Digital Wallet Application

#### A full-stack digital wallet application built with React.js frontend and Node.js/Express backend, featuring secure user authentication, account management, and money transfers.

## 🚀 Features


### User Management
User Registration & Authentication - Secure signup/signin with JWT tokens
Profile Management - Update user information
Email Validation - Proper email format validation
Password Security - Bcrypt hashing with salt rounds

### Account Management

Digital Wallet - Each user gets a digital account with balance
Balance Inquiry - Check account balance
Random Initial Balance - New users get random starting balance (1-10,000)

### Money Transfer

Secure Transfers - Transfer money between users
Transaction Validation - Prevents invalid transfers
Database Transactions - ACID compliance for financial operations
Balance Verification - Insufficient balance protection

### Security Features

JWT Authentication - Secure token-based authentication
Rate Limiting - Protection against API abuse
CORS Configuration - Cross-origin resource sharing
Helmet Security - HTTP headers security
Input Validation - Zod schema validation
Password Hashing - Bcrypt encryption

### 🛠️ Tech Stack
#### Backend

Node.js - Runtime environment
Express.js - Web framework
MongoDB - Database with Mongoose ODM
JWT - Authentication tokens
Bcrypt - Password hashing
Zod - Schema validation
Helmet - Security middleware
CORS - Cross-origin requests
Express Rate Limit - API rate limiting

#### Frontend

React.js - UI framework
React Router - Client-side routing
Axios - HTTP requests
Tailwind CSS - Styling framework
Context API - State management
