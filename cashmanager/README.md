# 💸 CashManager – Digital Wallet Application

A secure, full-stack digital wallet application enabling seamless user authentication, account management, and money transfers. Built with **React.js**, **Node.js**, **Express**, and **MongoDB**, it follows industry best practices for authentication, validation, and security.

---

## 🚀 Features

### 👤 User Management
- **JWT Authentication** – Secure sign-up and login with token-based auth  
- **Profile Management** – Update user details  
- **Email & Input Validation** – Enforced using **Zod** schema validation  
- **Password Security** – Hashed using **bcrypt** with salting  

### 💼 Account Management
- **Digital Wallet** – Each user is provisioned with a wallet  
- **Balance Inquiry** – Real-time balance display  
- **Random Initial Balance** – Assigned between ₹1 – ₹10,000 on registration  

### 💸 Money Transfer
- **Peer-to-Peer Transfers** – Send money securely to other users  
- **Transaction Validation** – Prevents invalid transfers  
- **ACID-Compliant Transactions** – Ensures database consistency  
- **Insufficient Balance Protection** – Block transfers without adequate funds  

---

## 🔐 Security Features
- **JWT** – Token-based session management  
- **Zod** – Input and schema validation  
- **Rate Limiting** – Prevents abuse of sensitive endpoints  
- **CORS Configuration** – Manages cross-origin requests  
- **Helmet** – Secures HTTP headers  
- **Bcrypt** – Encrypts passwords with salting  

---

## 🛠️ Tech Stack

### Backend
- **Node.js**, **Express.js** – Server runtime and framework  
- **MongoDB** (Mongoose ODM) – NoSQL database  
- **JWT** – Authentication  
- **Bcrypt** – Secure password storage  
- **Zod** – Input validation  
- **Helmet**, **CORS**, **Express Rate Limit** – Security middleware

### Frontend
- **React.js** – Component-based UI  
- **React Router** – Routing  
- **Axios** – API communication  
- **Tailwind CSS** – Responsive styling  
- **Context API** – Global state management

---