# CALM Backend API (Node.js + Express + MongoDB)

A RESTful backend API service built for the **CALM Society Management Application** using Node.js, Express.js, and MongoDB with Mongoose ORM. Built with a clean MVC + Service Layer architecture.

---

## 🏗️ Architecture & Project Structure

```
backend/
├── config/             # DB Connection (MongoDB / Mongoose)
│   └── db.js
├── models/             # Mongoose Schemas (User, Society, Resident, Transaction, Complaint, Asset, WaterTank, Event, SecretaryRegistration)
│   ├── User.js
│   ├── Society.js
│   ├── Resident.js
│   ├── Transaction.js
│   ├── Complaint.js
│   ├── Asset.js
│   ├── WaterTank.js
│   ├── Event.js
│   └── SecretaryRegistration.js
├── services/           # Business Logic & Database Queries Layer
│   ├── authService.js
│   ├── societyService.js
│   ├── residentService.js
│   ├── financeService.js
│   └── operationService.js
├── controllers/        # Request Handlers & API Responses
│   ├── authController.js
│   ├── societyController.js
│   ├── residentController.js
│   ├── financeController.js
│   └── operationController.js
├── routes/             # Express Route Definitions
│   ├── authRoutes.js
│   ├── societyRoutes.js
│   ├── residentRoutes.js
│   ├── financeRoutes.js
│   ├── operationRoutes.js
│   └── index.js
├── middleware/         # Auth JWT Guard, Error Handler, Input Validation
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── validateMiddleware.js
├── utils/              # Response Wrappers, Async Handlers, Seeders & Helpers
│   ├── apiResponse.js
│   ├── apiError.js
│   ├── asyncHandler.js
│   ├── generateToken.js
│   └── seedData.js
├── .env
├── package.json
└── server.js           # Server Entrypoint
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables (`.env`)
Create or verify `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/calm_db
JWT_SECRET=calm_super_secret_jwt_key_2026_change_in_production
JWT_EXPIRE=30d
```

### 3. Seed Initial Database
Run the seed script to populate MongoDB with initial society, residents, transactions, complaints, assets, water tanks, and default secretary user:
```bash
npm run seed
```

### 4. Start Server
```bash
# Development mode with auto-reload (nodemon)
npm run dev

# Production mode
npm start
```

---

## 📌 API Endpoints Overview

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register-secretary` - Register new secretary request
- `POST /api/auth/login` - Authenticate user & get JWT token
- `GET /api/auth/me` - Get logged-in user profile (Requires `Authorization: Bearer <token>`)

### 🏢 Society & Dashboard (`/api/society`)
- `GET /api/society/details` - Fetch society profile
- `GET /api/society/dashboard` - Fetch dashboard statistics & attention items

### 👥 Residents & Directory (`/api/residents`)
- `GET /api/residents` - List residents (Supports query filters: `search`, `block`, `status`, `paymentStatus`)
- `GET /api/residents/:id` - Fetch single resident details
- `POST /api/residents/owner` - Add new flat owner
- `POST /api/residents/tenant` - Add new tenant
- `PUT /api/residents/:id` - Update resident profile
- `DELETE /api/residents/:id` - Delete resident entry

### 💰 Finance (`/api/finance`)
- `GET /api/finance/summary` - Financial overview, balances, and major expenses
- `GET /api/finance/transactions` - Fetch transactions (Supports filters: `category`, `isCredit`, `search`)
- `POST /api/finance/transactions` - Log a new income/expense transaction

### 🛠️ Operations (`/api/operations`)
- `GET /api/operations/complaints` - Fetch complaints
- `POST /api/operations/complaints` - File a new complaint
- `PATCH /api/operations/complaints/:id/status` - Update complaint status (`Open`, `In Progress`, `Resolved`)
- `GET /api/operations/assets` - List society assets & maintenance status
- `POST /api/operations/assets` - Register new asset
- `GET /api/operations/water-tanks` - Water tank levels & cleaning schedules
- `PUT /api/operations/water-tanks/:id` - Update water tank level

---

## ⚡ Default Seed Credentials
- **Email:** `secretary@greenwood.com`
- **Password:** `password123`
