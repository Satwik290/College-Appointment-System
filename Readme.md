# 🎓 College Appointment System

A modern, robust backend API system for managing appointments between students and professors in a college environment. Built with Node.js, Express, TypeScript, and MongoDB.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.2-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### For Students
- 👤 **User Authentication** - Secure registration and login system
- 📅 **View Available Slots** - Browse professor availability in real-time
- 🎯 **Book Appointments** - Reserve time slots with professors
- 📊 **Manage Appointments** - View all booked appointments
- 🔒 **Role-based Access** - Student-specific endpoints and permissions

### For Professors
- 🕐 **Availability Management** - Create, update, and delete time slots
- 📋 **View Appointments** - See all student bookings
- ❌ **Cancel Appointments** - Cancel appointments when needed
- 🔐 **Protected Routes** - Professor-only access to management features

### System Features
- 🚀 **RESTful API** - Clean, intuitive API design
- 🔐 **JWT Authentication** - Secure token-based authentication
- ✅ **Input Validation** - Zod schema validation
- 🎭 **Role-based Authorization** - Middleware for access control
- 🛡️ **Error Handling** - Global error handler with detailed responses
- 🗄️ **MongoDB Integration** - Efficient data management with Mongoose
- 🍪 **Cookie Management** - Secure HTTP-only cookies
- 📝 **TypeScript** - Type-safe development
- 🔄 **CORS Enabled** - Cross-origin resource sharing

## 🛠️ Tech Stack

### Core
- **Runtime:** Node.js (v20+)
- **Language:** TypeScript 5.9
- **Framework:** Express.js 5.2
- **Database:** MongoDB with Mongoose ODM

### Authentication & Security
- **JWT:** jsonwebtoken for token management
- **Bcrypt:** bcryptjs for password hashing
- **CORS:** Cross-origin security
- **Cookie Parser:** Secure cookie handling

### Development Tools
- **tsx:** Fast TypeScript execution
- **nodemon:** Development auto-reload
- **ESLint:** Code quality and consistency
- **Prettier:** Code formatting
- **Morgan:** HTTP request logging

### Validation
- **Zod:** Schema validation and type inference

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.19.0 or higher
- **npm**: v6+ or yarn
- **MongoDB**: v7+ (local or Atlas)
- **Git**: For cloning the repository

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Satwik290/College-Appointment-System.git
cd College-Appointment-System
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables** (see [Environment Setup](#-environment-setup))

## 🔧 Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_CONNECTION_STRING=mongodb://localhost:27017/college-appointments
# OR for MongoDB Atlas:
# MONGO_CONNECTION_STRING=mongodb+srv://<username>:<password>@cluster.mongodb.net/college-appointments

# JWT Secret (use a strong, random string in production)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGO_CONNECTION_STRING` | MongoDB connection URL | `mongodb://localhost:27017/dbname` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |

## 🎯 Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with hot-reload using `tsx watch`.

### Production Build
```bash
# Build the TypeScript code
npm run build

# Start the production server
npm start
```

### Code Formatting
```bash
# Format all TypeScript files
npm run format

# Check formatting without making changes
npm run format:check
```

The server will start on `http://localhost:5000` (or your specified PORT).

### Health Check
Once running, verify the server:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // or "professor"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Availability Endpoints

#### Create Availability (Professor Only)
```http
POST /api/availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "startTime": "2024-03-20T10:00:00.000Z",
  "endTime": "2024-03-20T11:00:00.000Z"
}
```

#### Get Professor's Own Slots (Professor Only)
```http
GET /api/availability/me
Authorization: Bearer <token>
```

#### View Available Slots for a Professor (Student Only)
```http
GET /api/availability/:professorId
Authorization: Bearer <token>
```

#### Update Availability Slot (Professor Only)
```http
PUT /api/availability/:slotId
Authorization: Bearer <token>
Content-Type: application/json

{
  "startTime": "2024-03-20T14:00:00.000Z",
  "endTime": "2024-03-20T15:00:00.000Z"
}
```

#### Delete Availability Slot (Professor Only)
```http
DELETE /api/availability/:slotId
Authorization: Bearer <token>
```

### Appointment Endpoints

#### Book Appointment (Student Only)
```http
POST /api/appointments/:slotId
Authorization: Bearer <token>
```

#### Get My Appointments (Student Only)
```http
GET /api/appointments/me
Authorization: Bearer <token>
```

#### Get Professor's Appointments (Professor Only)
```http
GET /api/appointments/professor/me
Authorization: Bearer <token>
```

#### Cancel Appointment (Professor Only)
```http
DELETE /api/appointments/:appointmentId
Authorization: Bearer <token>
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

#### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 500 | Internal Server Error |

## 📁 Project Structure

```
College-Appointment-System/
├── src/
│   ├── config/
│   │   └── db.ts                    # MongoDB connection
│   ├── middlewares/
│   │   ├── auth.middleware.ts       # JWT authentication
│   │   ├── role.middleware.ts       # Role-based access control
│   │   └── error.middleware.ts      # Global error handler
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts   # Auth handlers
│   │   │   ├── auth.routes.ts       # Auth routes
│   │   │   ├── auth.service.ts      # Auth business logic
│   │   │   └── auth.validation.ts   # Zod schemas
│   │   ├── user/
│   │   │   └── user.model.ts        # User schema
│   │   ├── availability/
│   │   │   ├── availability.controller.ts
│   │   │   ├── availability.routes.ts
│   │   │   ├── availability.service.ts
│   │   │   ├── availability.model.ts
│   │   │   └── availability.validation.ts
│   │   └── appointment/
│   │       ├── appointment.controller.ts
│   │       ├── appointment.routes.ts
│   │       ├── appointment.service.ts
│   │       └── appointment.model.ts
│   ├── types/
│   │   └── express.d.ts             # Express type extensions
│   ├── utils/
│   │   └── generateToken.ts         # JWT utility
│   ├── app.ts                       # Express app setup
│   └── server.ts                    # Server entry point
├── .env.example                      # Environment variables template
├── .gitignore
├── .prettierrc                       # Prettier configuration
├── .prettierignore
├── eslint.config.ts                  # ESLint configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json
└── README.md
```

## 🏗️ Architecture

### Modular Design
The project follows a modular architecture with each feature (auth, availability, appointment) contained in its own module:

```
Module/
├── *.controller.ts  → HTTP handlers
├── *.routes.ts      → Route definitions
├── *.service.ts     → Business logic
├── *.model.ts       → Database schema
└── *.validation.ts  → Input validation
```

### Key Design Patterns

1. **Separation of Concerns**: Controllers, services, and models are separated
2. **Middleware Pipeline**: Authentication → Authorization → Validation → Handler
3. **Error Handling**: Centralized error handling with custom error types
4. **Type Safety**: Full TypeScript coverage with strict mode
5. **Validation Layer**: Zod schemas for runtime validation
6. **Repository Pattern**: Mongoose models abstract database operations

### Data Flow

```
Client Request
    ↓
Router
    ↓
Auth Middleware → Role Middleware
    ↓
Controller (Request Validation)
    ↓
Service (Business Logic)
    ↓
Model (Database Operations)
    ↓
Response
```

## 🗄️ Database Schema

### User Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique, indexed),
  password: string (hashed),
  role: "student" | "professor",
  createdAt: Date,
  updatedAt: Date
}
```

### Availability Collection
```typescript
{
  _id: ObjectId,
  professor: ObjectId (ref: User),
  startTime: Date (indexed),
  endTime: Date,
  isBooked: boolean,
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:** 
- `{ professor: 1, startTime: 1 }` (unique)
- `startTime: 1`

### Appointment Collection
```typescript
{
  _id: ObjectId,
  student: ObjectId (ref: User),
  professor: ObjectId (ref: User),
  slot: ObjectId (ref: Availability, unique),
  status: "booked" | "cancelled",
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure, stateless authentication
- **HTTP-Only Cookies**: XSS protection
- **CORS**: Configured cross-origin policies
- **Input Validation**: Zod schema validation
- **Role-Based Access**: Middleware protection
- **MongoDB Injection Prevention**: Mongoose sanitization

## 🧪 Testing

Test your API using tools like:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [curl](https://curl.se/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)

### Sample Postman Collection Structure
```
College Appointment System
├── Auth
│   ├── Register Student
│   ├── Register Professor
│   ├── Login
│   └── Logout
├── Availability
│   ├── Create Slot
│   ├── Get My Slots
│   ├── View Professor Slots
│   ├── Update Slot
│   └── Delete Slot
└── Appointments
    ├── Book Appointment
    ├── Get My Appointments
    ├── Get Professor Appointments
    └── Cancel Appointment
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards
- Follow the existing code style
- Run `npm run format` before committing
- Add comments for complex logic
- Update documentation for new features

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Satwik** - [GitHub](https://github.com/Satwik290)

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB team for the robust database
- TypeScript team for type safety
- All open-source contributors

## 📞 Support

For support, email [your-email@example.com] or open an issue on GitHub.

---

**Happy Coding! 🚀**