# College Appointment System - API Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Error Handling](#error-handling)
- [Auth Endpoints](#auth-endpoints)
- [Availability Endpoints](#availability-endpoints)
- [Appointment Endpoints](#appointment-endpoints)
- [Response Formats](#response-formats)
- [Complete Workflow Example](#complete-workflow-example)
- [Security Features](#security-features)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)

---

## Overview

The **College Appointment System** is a production-ready backend API that enables students and professors to manage appointment scheduling efficiently. Professors can create availability slots, and students can book appointments during those slots. The system includes role-based access control, JWT authentication, and comprehensive appointment management.

### Key Features
- ✅ User registration and login (Student/Professor roles)
- ✅ Professor availability slot management (Create, Read, Update, Delete)
- ✅ Student appointment booking with automatic slot management
- ✅ Appointment cancellation with slot liberation
- ✅ JWT-based authentication with 24-hour expiry
- ✅ Role-based access control (RBAC)
- ✅ Double-booking prevention via unique constraints
- ✅ Comprehensive error handling and validation
- ✅ MongoDB database with proper indexing

### Technology Stack
- **Framework:** Express.js 5.2.1 (Node.js)
- **Database:** MongoDB 7.0.0 with Mongoose 9.2.2
- **Authentication:** JWT (JSON Web Tokens) 9.0.3
- **Validation:** Zod 4.3.6 schema validation
- **Security:** bcryptjs 3.0.3 password hashing, CORS, Cookie-based tokens
- **Language:** TypeScript 5.9.3

---

## Base URL

```
http://localhost:5000/api
```

### Environment Configuration
Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_CONNECTION_STRING= 
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
```

---

## Authentication

### Token Management
- **Issued:** Upon successful login via `/auth/login` endpoint
- **Duration:** Valid for 24 hours
- **Storage:** Can be stored in cookies (httpOnly) or Authorization headers
- **Format:** `Authorization: Bearer <token>`
- **Expiration:** After 24 hours, user must login again

### Passing Tokens

#### Method 1: Via Cookie (Automatic)
Token is automatically set and sent with each request:
```
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Method 2: Via Authorization Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Protected Routes
All endpoints except the following require authentication:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /health` - Server health check

### JWT Payload Structure
```json
{
  "id": "507f191e810c19729de860ea",
  "role": "student|professor",
  "iat": 1709049600,
  "exp": 1709136000
}
```

---

## Error Handling

All error responses follow a consistent format:

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

### HTTP Status Codes
| Code | Meaning | Common Cause |
|------|---------|--------------|
| 200 | OK | Successful request |
| 201 | Created | Resource successfully created |
| 400 | Bad Request | Invalid input, validation failed |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Token valid but lacks required permissions |
| 500 | Server Error | Unexpected server-side error |

### Error Response Examples

**Invalid Token (401):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**Insufficient Permissions (403):**
```json
{
  "success": false,
  "message": "Forbidden: Access denied"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Name must be at least 2 characters"
}
```

---

# Auth Endpoints

## 1. Register User

Create a new user account as either a student or professor. Each user gets a unique email and a JWT token upon registration.

**Endpoint:**
```
POST /auth/register
```

**Authentication:** ❌ Not required

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPass123",
  "role": "student"
}
```

**Field Validation:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | Yes | Min 2 characters, max 100 |
| email | string | Yes | Valid email format, unique in database |
| password | string | Yes | Min 6 characters, alphanumeric recommended |
| role | enum | Yes | `"student"` or `"professor"` only |

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzA5MDQ5NjAwLCJleHAiOjE3MDkxMzYwMDB9.4K3v5Z2m8N9p0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K",
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Error Response - Email Already Exists (400):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

**Error Response - Invalid Email (400):**
```json
{
  "success": false,
  "message": "Invalid email address"
}
```

**Error Response - Short Password (400):**
```json
{
  "success": false,
  "message": "Password must be at least 6 characters"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@college.edu",
    "password": "SecurePassword123",
    "role": "professor"
  }'
```

---

## 2. Login User

Authenticate a user with email and password. Returns a JWT token valid for 24 hours.

**Endpoint:**
```
POST /auth/login
```

**Authentication:** ❌ Not required

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "StrongPass123"
}
```

**Field Validation:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| email | string | Yes | Valid email format |
| password | string | Yes | Min 6 characters |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzA5MDQ5NjAwLCJleHAiOjE3MDkxMzYwMDB9.4K3v5Z2m8N9p0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K",
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Cookie Set Automatically:**
The response includes a Set-Cookie header:
```
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict; Max-Age=86400
```

**Error Response - Invalid Credentials (400):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Error Response - Invalid Email (400):**
```json
{
  "success": false,
  "message": "Invalid email address"
}
```

**Note on Password Hashing:**
- Passwords are hashed using bcryptjs with 10 salt rounds
- Plain password never stored in database
- Original password cannot be recovered

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "StrongPass123"
  }' \
  -c cookies.txt
```

---

## 3. Logout User

Clear the authentication token and end the session. Clears the httpOnly cookie on client side.

**Endpoint:**
```
POST /auth/logout
```

**Authentication:** ❌ Not required (but recommended to have valid token)

**Request Body:** Empty or can be omitted

```json
{}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Cookie Cleared:**
```
Set-Cookie: token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0
```

**Side Effects:**
- Token cookie is cleared
- Any subsequent requests without a new token will fail with 401 Unauthorized
- Session is ended

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

---

# Availability Endpoints

## 1. Create Availability Slot

Professor creates a new availability time slot for appointments. Only professors can create slots.

**Endpoint:**
```
POST /availability
```

**Authentication:** ✅ Required (Professor only)

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "startTime": "2026-03-01T10:00:00.000Z",
  "endTime": "2026-03-01T11:00:00.000Z"
}
```

**Field Validation:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| startTime | ISO 8601 | Yes | UTC format, must be before endTime |
| endTime | ISO 8601 | Yes | UTC format, must be after startTime |

**Business Rules:**
- Start time must be before end time
- Duplicate slots (same professor, same startTime) are prevented by unique index
- Slot is marked as unbooked by default (isBooked: false)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "professor": "507f191e810c19729de860ea",
    "startTime": "2026-03-01T10:00:00.000Z",
    "endTime": "2026-03-01T11:00:00.000Z",
    "isBooked": false,
    "createdAt": "2026-02-28T15:30:00.000Z",
    "updatedAt": "2026-02-28T15:30:00.000Z"
  }
}
```

**Error Response - Invalid Times (400):**
```json
{
  "success": false,
  "message": "Start time must be before end time"
}
```

**Error Response - Unauthorized (401):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**Error Response - Insufficient Permissions (403):**
```json
{
  "success": false,
  "message": "Forbidden: Access denied"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/availability \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "startTime": "2026-03-15T14:00:00.000Z",
    "endTime": "2026-03-15T15:00:00.000Z"
  }'
```

**Time Zone Notes:**
- All times must be in UTC (ISO 8601 format)
- Example: 3 PM EST = "2026-03-01T20:00:00.000Z"
- Frontend should convert local times to UTC before sending

---

## 2. Get Professor's Own Slots

Retrieve all availability slots (booked and unbooked) created by the logged-in professor.

**Endpoint:**
```
GET /availability/me
```

**Authentication:** ✅ Required (Professor only)

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "professor": "507f191e810c19729de860ea",
      "startTime": "2026-03-01T10:00:00.000Z",
      "endTime": "2026-03-01T11:00:00.000Z",
      "isBooked": false,
      "createdAt": "2026-02-28T15:30:00.000Z",
      "updatedAt": "2026-02-28T15:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "professor": "507f191e810c19729de860ea",
      "startTime": "2026-03-01T14:00:00.000Z",
      "endTime": "2026-03-01T15:00:00.000Z",
      "isBooked": true,
      "createdAt": "2026-02-28T15:35:00.000Z",
      "updatedAt": "2026-02-28T16:00:00.000Z"
    }
  ]
}
```

**Response Details:**
- Sorted by startTime in ascending order (earliest first)
- Includes both booked and unbooked slots
- Booked status shown in isBooked field

**Error Response - Unauthorized (401):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/availability/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 3. Get Available Slots for a Professor

Student views only unbooked (available) slots for a specific professor. This is used for booking appointments.

**Endpoint:**
```
GET /availability/:professorId
```

**Authentication:** ✅ Required (Student only)

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| professorId | string (MongoDB ObjectId) | Yes | 24-character hex string of the professor |

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "professor": "507f191e810c19729de860ea",
      "startTime": "2026-03-01T10:00:00.000Z",
      "endTime": "2026-03-01T11:00:00.000Z",
      "isBooked": false,
      "createdAt": "2026-02-28T15:30:00.000Z",
      "updatedAt": "2026-02-28T15:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "professor": "507f191e810c19729de860ea",
      "startTime": "2026-03-01T15:00:00.000Z",
      "endTime": "2026-03-01T16:00:00.000Z",
      "isBooked": false,
      "createdAt": "2026-02-28T15:40:00.000Z",
      "updatedAt": "2026-02-28T15:40:00.000Z"
    }
  ]
}
```

**Response Details:**
- Only includes slots where isBooked is false
- Sorted by startTime in ascending order
- Empty array if professor has no available slots

**Filter Logic:**
```
professor = :professorId AND isBooked = false
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/availability/507f191e810c19729de860ea \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

**Important Note:**
- Always verify professorId exists before calling this endpoint
- Use a GET /users/:id endpoint to verify professor details if needed

---

## 4. Update Availability Slot

Modify the start and end times of an existing availability slot. Can only update unbooked slots.

**Endpoint:**
```
PUT /availability/:slotId
```

**Authentication:** ✅ Required (Professor only)

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slotId | string (MongoDB ObjectId) | Yes | 24-character hex string of the slot |

**Request Body:**
```json
{
  "startTime": "2026-03-01T11:00:00.000Z",
  "endTime": "2026-03-01T12:00:00.000Z"
}
```

**Field Validation:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| startTime | ISO 8601 | Yes | UTC format, must be before endTime |
| endTime | ISO 8601 | Yes | UTC format, must be after startTime |

**Business Rules:**
- Only the slot owner (professor who created it) can update
- Cannot update a booked slot
- New times must be valid (start before end)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "professor": "507f191e810c19729de860ea",
    "startTime": "2026-03-01T11:00:00.000Z",
    "endTime": "2026-03-01T12:00:00.000Z",
    "isBooked": false,
    "createdAt": "2026-02-28T15:30:00.000Z",
    "updatedAt": "2026-02-28T16:45:00.000Z"
  }
}
```

**Error Response - Slot Already Booked (400):**
```json
{
  "success": false,
  "message": "Cannot update a booked slot"
}
```

**Error Response - Slot Not Found (400):**
```json
{
  "success": false,
  "message": "Slot not found"
}
```

**Error Response - Invalid Times (400):**
```json
{
  "success": false,
  "message": "Start time must be before end time"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/availability/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PROFESSOR_TOKEN" \
  -d '{
    "startTime": "2026-03-01T16:00:00.000Z",
    "endTime": "2026-03-01T17:00:00.000Z"
  }'
```

---

## 5. Delete Availability Slot

Remove an availability slot from the system. Can only delete unbooked slots.

**Endpoint:**
```
DELETE /availability/:slotId
```

**Authentication:** ✅ Required (Professor only)

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slotId | string (MongoDB ObjectId) | Yes | 24-character hex string of the slot |

**Request Body:** None

**Business Rules:**
- Only the slot owner (professor who created it) can delete
- Cannot delete a booked slot (appointment exists)
- Deletion is permanent and cannot be undone

**Success Response (200):**
```json
{
  "success": true,
  "message": "Slot deleted successfully"
}
```

**Error Response - Slot Booked (400):**
```json
{
  "success": false,
  "message": "Cannot delete a booked slot"
}
```

**Error Response - Slot Not Found (400):**
```json
{
  "success": false,
  "message": "Slot not found"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/availability/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer PROFESSOR_TOKEN"
```

---

# Appointment Endpoints

## 1. Book Appointment

Student books an appointment during an available professor slot. Automatically marks the slot as booked.

**Endpoint:**
```
POST /appointments/:slotId
```

**Authentication:** ✅ Required (Student only)

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slotId | string (MongoDB ObjectId) | Yes | 24-character hex string of the availability slot |

**Request Body:** None (student ID automatically extracted from JWT)

**Business Rules:**
- Only students can book appointments
- Slot must exist and be unbooked
- One appointment per slot (prevents double-booking via unique constraint)
- Professor is automatically determined from the slot

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "607f1f77bcf86cd799439055",
    "student": "507f191e810c19729de860eb",
    "professor": "507f191e810c19729de860ea",
    "slot": "507f1f77bcf86cd799439011",
    "status": "booked",
    "createdAt": "2026-02-28T16:50:00.000Z",
    "updatedAt": "2026-02-28T16:50:00.000Z"
  }
}
```

**Error Response - Slot Already Booked (400):**
```json
{
  "success": false,
  "message": "Slot already booked or not found"
}
```

**Error Response - Unauthorized (401):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**Error Response - Forbidden (403):**
```json
{
  "success": false,
  "message": "Forbidden: Access denied"
}
```

**Side Effects:**
- Associated slot's isBooked field is set to true
- Appointment record is created
- Timestamp recorded

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/appointments/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

**Race Condition Prevention:**
The unique constraint on the slot field in the Appointment collection prevents race conditions where two students might attempt to book the same slot simultaneously.

---

## 2. Get Student's Appointments

View all booked appointments for the logged-in student. Includes professor and slot details.

**Endpoint:**
```
GET /appointments/me
```

**Authentication:** ✅ Required (Student only)

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "607f1f77bcf86cd799439055",
      "student": "507f191e810c19729de860eb",
      "professor": {
        "_id": "507f191e810c19729de860ea",
        "name": "Dr. Jane Smith",
        "email": "jane@college.edu"
      },
      "slot": {
        "_id": "507f1f77bcf86cd799439011",
        "startTime": "2026-03-01T10:00:00.000Z",
        "endTime": "2026-03-01T11:00:00.000Z",
        "isBooked": true,
        "professor": "507f191e810c19729de860ea"
      },
      "status": "booked",
      "createdAt": "2026-02-28T16:50:00.000Z",
      "updatedAt": "2026-02-28T16:50:00.000Z"
    },
    {
      "_id": "607f1f77bcf86cd799439056",
      "student": "507f191e810c19729de860eb",
      "professor": {
        "_id": "507f191e810c19729de860ec",
        "name": "Dr. John Wilson",
        "email": "john.w@college.edu"
      },
      "slot": {
        "_id": "507f1f77bcf86cd799439012",
        "startTime": "2026-03-02T14:00:00.000Z",
        "endTime": "2026-03-02T15:00:00.000Z",
        "isBooked": true,
        "professor": "507f191e810c19729de860ec"
      },
      "status": "booked",
      "createdAt": "2026-02-28T17:20:00.000Z",
      "updatedAt": "2026-02-28T17:20:00.000Z"
    }
  ]
}
```

**Response Details:**
- Only includes appointments with status "booked"
- Excludes cancelled appointments
- Sorted by creation date (newest first)
- Professor details (name, email) are populated
- Slot details are populated

**Empty Response:**
```json
{
  "success": true,
  "data": []
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/appointments/me \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

---

## 3. Get Professor's Appointments

View all booked appointments for the logged-in professor. Shows which students have booked time slots.

**Endpoint:**
```
GET /appointments/professor/me
```

**Authentication:** ✅ Required (Professor only)

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "607f1f77bcf86cd799439055",
      "professor": "507f191e810c19729de860ea",
      "student": {
        "_id": "507f191e810c19729de860eb",
        "name": "John Doe",
        "email": "john@college.edu"
      },
      "slot": {
        "_id": "507f1f77bcf86cd799439011",
        "startTime": "2026-03-01T10:00:00.000Z",
        "endTime": "2026-03-01T11:00:00.000Z",
        "isBooked": true,
        "professor": "507f191e810c19729de860ea"
      },
      "status": "booked",
      "createdAt": "2026-02-28T16:50:00.000Z",
      "updatedAt": "2026-02-28T16:50:00.000Z"
    },
    {
      "_id": "607f1f77bcf86cd799439057",
      "professor": "507f191e810c19729de860ea",
      "student": {
        "_id": "507f191e810c19729de860ec",
        "name": "Jane Wilson",
        "email": "jane.w@college.edu"
      },
      "slot": {
        "_id": "507f1f77bcf86cd799439013",
        "startTime": "2026-03-01T15:00:00.000Z",
        "endTime": "2026-03-01T16:00:00.000Z",
        "isBooked": true,
        "professor": "507f191e810c19729de860ea"
      },
      "status": "booked",
      "createdAt": "2026-02-28T17:10:00.000Z",
      "updatedAt": "2026-02-28T17:10:00.000Z"
    }
  ]
}
```

**Response Details:**
- Only includes appointments with status "booked"
- Sorted by creation date (newest first)
- Student details (name, email) are populated
- Slot details are populated
- Filters by professor ID from JWT token

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/appointments/professor/me \
  -H "Authorization: Bearer PROFESSOR_TOKEN"
```

---

## 4. Cancel Appointment

Professor cancels a booked appointment and frees up the slot for other students. Only professors can cancel.

**Endpoint:**
```
DELETE /appointments/:appointmentId
```

**Authentication:** ✅ Required (Professor only)

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| appointmentId | string (MongoDB ObjectId) | Yes | 24-character hex string of the appointment |

**Request Body:** None

**Business Rules:**
- Only the appointment's professor can cancel
- Only "booked" status appointments can be cancelled
- Cancellation frees up the slot for other bookings
- Cancellation is permanent but can be re-booked later

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "607f1f77bcf86cd799439055",
    "student": "507f191e810c19729de860eb",
    "professor": "507f191e810c19729de860ea",
    "slot": "507f1f77bcf86cd799439011",
    "status": "cancelled",
    "createdAt": "2026-02-28T16:50:00.000Z",
    "updatedAt": "2026-02-28T17:15:00.000Z"
  }
}
```

**Error Response - Appointment Not Found (400):**
```json
{
  "success": false,
  "message": "Appointment not found"
}
```

**Error Response - Forbidden (403):**
```json
{
  "success": false,
  "message": "Forbidden: Access denied"
}
```

**Side Effects:**
- Appointment status changes from "booked" to "cancelled"
- Associated slot's isBooked field is set to false
- Slot becomes available for new bookings
- Timestamp updated

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/appointments/607f1f77bcf86cd799439055 \
  -H "Authorization: Bearer PROFESSOR_TOKEN"
```

---

# Health Check

## Server Health

Simple endpoint to check if the API server is running and responding.

**Endpoint:**
```
GET /health
```

**Authentication:** ❌ Not required

**Request Headers:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Server is running"
}
```

**Usage:**
- Health checks by monitoring systems
- Load balancer checks
- Frontend readiness checks

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/health
```

---

# Response Formats

## Standard Success Response

All successful responses follow this format:

```json
{
  "success": true,
  "data": { /* response data */ }
}
```

## Standard Error Response

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Data Types

### User Object

```json
{
  "_id": "507f191e810c19729de860ea",
  "name": "Dr. Jane Smith",
  "email": "jane@college.edu",
  "role": "professor",
  "createdAt": "2026-01-15T10:30:00.000Z",
  "updatedAt": "2026-01-15T10:30:00.000Z"
}
```

**Fields:**
- `_id`: MongoDB ObjectId, automatically generated
- `name`: User's full name
- `email`: Unique email address
- `role`: Either "student" or "professor"
- `password`: Hashed using bcryptjs (never returned in API)
- `createdAt`: ISO 8601 timestamp
- `updatedAt`: ISO 8601 timestamp

### Availability Slot Object

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "professor": "507f191e810c19729de860ea",
  "startTime": "2026-03-01T10:00:00.000Z",
  "endTime": "2026-03-01T11:00:00.000Z",
  "isBooked": false,
  "createdAt": "2026-02-28T15:30:00.000Z",
  "updatedAt": "2026-02-28T15:30:00.000Z"
}
```

**Fields:**
- `_id`: MongoDB ObjectId
- `professor`: Reference to User document (professor)
- `startTime`: Slot start time (UTC)
- `endTime`: Slot end time (UTC)
- `isBooked`: Boolean indicating if appointment exists
- `createdAt`: When slot was created
- `updatedAt`: When slot was last modified

### Appointment Object

```json
{
  "_id": "607f1f77bcf86cd799439055",
  "student": "507f191e810c19729de860eb",
  "professor": "507f191e810c19729de860ea",
  "slot": "507f1f77bcf86cd799439011",
  "status": "booked",
  "createdAt": "2026-02-28T16:50:00.000Z",
  "updatedAt": "2026-02-28T16:50:00.000Z"
}
```

**Fields:**
- `_id`: MongoDB ObjectId
- `student`: Reference to Student User document
- `professor`: Reference to Professor User document
- `slot`: Reference to Availability Slot document (unique)
- `status`: Either "booked" or "cancelled"
- `createdAt`: When appointment was created
- `updatedAt`: When appointment was last modified

---

# Complete Workflow Example

This section demonstrates a complete workflow from registration through appointment booking.

## Step 1: Professor Registration

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Jane Smith",
    "email": "jane.smith@college.edu",
    "password": "SecurePassword123!",
    "role": "professor"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": "507f191e810c19729de860ea",
    "name": "Dr. Jane Smith",
    "email": "jane.smith@college.edu",
    "role": "professor"
  }
}
```

**Save:** Token for professor operations: `PROF_TOKEN`

---

## Step 2: Professor Creates Availability Slots

**Request 1 - Morning Slot:**
```bash
curl -X POST http://localhost:5000/api/availability \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PROF_TOKEN" \
  -d '{
    "startTime": "2026-03-15T09:00:00.000Z",
    "endTime": "2026-03-15T10:00:00.000Z"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "slot_morning_001",
    "professor": "507f191e810c19729de860ea",
    "startTime": "2026-03-15T09:00:00.000Z",
    "endTime": "2026-03-15T10:00:00.000Z",
    "isBooked": false,
    "createdAt": "2026-02-28T16:00:00.000Z",
    "updatedAt": "2026-02-28T16:00:00.000Z"
  }
}
```

**Request 2 - Afternoon Slot:**
```bash
curl -X POST http://localhost:5000/api/availability \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PROF_TOKEN" \
  -d '{
    "startTime": "2026-03-15T14:00:00.000Z",
    "endTime": "2026-03-15T15:00:00.000Z"
  }'
```

**Save:** Slot IDs: `slot_morning_001`, `slot_afternoon_001`

---

## Step 3: Student Registration

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@college.edu",
    "password": "StudentPassword456!",
    "role": "student"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": "507f191e810c19729de860eb",
    "name": "John Doe",
    "email": "john.doe@college.edu",
    "role": "student"
  }
}
```

**Save:** Token for student operations: `STUDENT_TOKEN`

---

## Step 4: Student Views Available Slots

**Request:**
```bash
curl -X GET http://localhost:5000/api/availability/507f191e810c19729de860ea \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "slot_morning_001",
      "professor": "507f191e810c19729de860ea",
      "startTime": "2026-03-15T09:00:00.000Z",
      "endTime": "2026-03-15T10:00:00.000Z",
      "isBooked": false,
      "createdAt": "2026-02-28T16:00:00.000Z",
      "updatedAt": "2026-02-28T16:00:00.000Z"
    },
    {
      "_id": "slot_afternoon_001",
      "professor": "507f191e810c19729de860ea",
      "startTime": "2026-03-15T14:00:00.000Z",
      "endTime": "2026-03-15T15:00:00.000Z",
      "isBooked": false,
      "createdAt": "2026-02-28T16:05:00.000Z",
      "updatedAt": "2026-02-28T16:05:00.000Z"
    }
  ]
}
```

---

## Step 5: Student Books Appointment

**Request:**
```bash
curl -X POST http://localhost:5000/api/appointments/slot_morning_001 \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "appointment_001",
    "student": "507f191e810c19729de860eb",
    "professor": "507f191e810c19729de860ea",
    "slot": "slot_morning_001",
    "status": "booked",
    "createdAt": "2026-02-28T17:00:00.000Z",
    "updatedAt": "2026-02-28T17:00:00.000Z"
  }
}
```

---

## Step 6: Professor Views Booked Appointments

**Request:**
```bash
curl -X GET http://localhost:5000/api/appointments/professor/me \
  -H "Authorization: Bearer PROF_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "appointment_001",
      "professor": "507f191e810c19729de860ea",
      "student": {
        "_id": "507f191e810c19729de860eb",
        "name": "John Doe",
        "email": "john.doe@college.edu"
      },
      "slot": {
        "_id": "slot_morning_001",
        "startTime": "2026-03-15T09:00:00.000Z",
        "endTime": "2026-03-15T10:00:00.000Z",
        "isBooked": true,
        "professor": "507f191e810c19729de860ea"
      },
      "status": "booked",
      "createdAt": "2026-02-28T17:00:00.000Z",
      "updatedAt": "2026-02-28T17:00:00.000Z"
    }
  ]
}
```

---

## Step 7: Student Views Booked Appointments

**Request:**
```bash
curl -X GET http://localhost:5000/api/appointments/me \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "appointment_001",
      "student": "507f191e810c19729de860eb",
      "professor": {
        "_id": "507f191e810c19729de860ea",
        "name": "Dr. Jane Smith",
        "email": "jane.smith@college.edu"
      },
      "slot": {
        "_id": "slot_morning_001",
        "startTime": "2026-03-15T09:00:00.000Z",
        "endTime": "2026-03-15T10:00:00.000Z",
        "isBooked": true,
        "professor": "507f191e810c19729de860ea"
      },
      "status": "booked",
      "createdAt": "2026-02-28T17:00:00.000Z",
      "updatedAt": "2026-02-28T17:00:00.000Z"
    }
  ]
}
```

---

## Step 8: Professor Cancels Appointment (Optional)

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/appointments/appointment_001 \
  -H "Authorization: Bearer PROF_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "appointment_001",
    "student": "507f191e810c19729de860eb",
    "professor": "507f191e810c19729de860ea",
    "slot": "slot_morning_001",
    "status": "cancelled",
    "createdAt": "2026-02-28T17:00:00.000Z",
    "updatedAt": "2026-02-28T17:30:00.000Z"
  }
}
```

**Result:** Slot `slot_morning_001` is now available for booking again

---

# Security Features

### Authentication & Authorization
✅ **JWT Authentication** - Stateless, secure token-based authentication
✅ **24-Hour Token Expiry** - Tokens automatically invalidate after 24 hours
✅ **Role-Based Access Control (RBAC)** - Student vs Professor permissions enforced
✅ **Protected Routes** - Middleware validates token on protected endpoints

### Password Security
✅ **bcryptjs Hashing** - Passwords hashed with 10 salt rounds
✅ **Never Stored in Plain Text** - Original password cannot be recovered
✅ **Constant-Time Comparison** - Prevents timing attacks

### Data Protection
✅ **CORS Protection** - Cross-origin requests handled securely
✅ **HttpOnly Cookies** - Prevents XSS attacks accessing tokens
✅ **Secure Flag** - Cookies only sent over HTTPS in production
✅ **SameSite Attribute** - Prevents CSRF attacks

### Database Safety
✅ **Double-Booking Prevention** - Unique constraint on slot field in Appointment
✅ **Foreign Key References** - Referential integrity with Mongoose
✅ **Proper Indexing** - Performance optimization on common queries

### Input Validation
✅ **Zod Schema Validation** - Type-safe input validation
✅ **Email Format Validation** - Invalid emails rejected
✅ **Required Fields** - All mandatory fields enforced
✅ **String Length Limits** - Prevents buffer overflow attacks

### Error Handling
✅ **Generic Error Messages** - No sensitive information leaked
✅ **HTTP Status Codes** - Proper status codes for different scenarios
✅ **No Stack Traces** - Production errors don't expose internals
✅ **Graceful Degradation** - Server continues running on errors

---

# Database Schema

## User Collection

```javascript
db.users.createIndex({ email: 1 }, { unique: true })

{
  _id: ObjectId,
  name: String,                    // min 2, max 100 chars
  email: String,                   // unique, lowercase
  password: String,                // bcryptjs hashed
  role: String,                    // enum: "student" | "professor"
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Primary: `_id`
- Unique: `email`

---

## Availability Collection

```javascript
db.availability.createIndex({ professor: 1, startTime: 1 }, { unique: true })
db.availability.createIndex({ professor: 1, startTime: 1 })

{
  _id: ObjectId,
  professor: ObjectId,             // ref: User
  startTime: Date,                 // UTC, ISO 8601
  endTime: Date,                   // UTC, ISO 8601
  isBooked: Boolean,               // default: false
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Primary: `_id`
- Unique: `professor, startTime`
- Regular: `professor, startTime` (for queries)

**Business Rules:**
- startTime must be before endTime
- No duplicate slots for same professor and startTime

---

## Appointment Collection

```javascript
db.appointments.createIndex({ slot: 1 }, { unique: true })

{
  _id: ObjectId,
  student: ObjectId,               // ref: User
  professor: ObjectId,             // ref: User
  slot: ObjectId,                  // ref: Availability (unique)
  status: String,                  // enum: "booked" | "cancelled"
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Primary: `_id`
- Unique: `slot`

**Business Rules:**
- One appointment per slot (unique constraint)
- Prevents double-booking automatically
- Professor extracted from related slot

---

# Troubleshooting

## Authentication Issues

| Issue | Solution |
|-------|----------|
| `401 Unauthorized - No token provided` | Login first, then include token in requests |
| `401 Unauthorized - Invalid token` | Token may be expired. Login again to get new token. |
| `403 Forbidden - Access denied` | Verify your role (student/professor) has permission |

**Example Fix:**
```bash
# Login first
RESPONSE=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}')

# Extract token from response
TOKEN=$(echo $RESPONSE | jq -r '.data.token')

# Use token in subsequent requests
curl -X GET http://localhost:5000/api/appointments/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## Appointment Issues

| Issue | Solution |
|-------|----------|
| `Slot already booked or not found` | Slot may already be booked or doesn't exist |
| `Cannot update a booked slot` | Only unbooked slots can be modified |
| `Cannot delete a booked slot` | Cancel appointment first, then delete slot |
| `Appointment not found` | Verify appointmentId is correct |

---

## Time Zone Issues

| Issue | Solution |
|-------|----------|
| Appointments appear at wrong time | Ensure all times are in UTC (ISO 8601 format) |
| Can't parse startTime/endTime | Use format: `2026-03-15T14:00:00.000Z` |

**Time Conversion Examples:**
```
Local Time: 3:00 PM EST (UTC-5)
UTC Time: 8:00 PM → "2026-03-15T20:00:00.000Z"

Local Time: 9:00 AM PST (UTC-8)
UTC Time: 5:00 PM → "2026-03-15T17:00:00.000Z"

Local Time: 12:00 PM IST (UTC+5:30)
UTC Time: 6:30 AM → "2026-03-15T06:30:00.000Z"
```

---

## Database Connection Issues

| Issue | Solution |
|-------|----------|
| `Failed to connect to MongoDB` | Verify MONGO_CONNECTION_STRING in .env |
| `Connection timeout` | Check MongoDB service is running |
| `Invalid connection string` | Ensure credentials are URL-encoded |

---

## Validation Errors

| Issue | Solution |
|-------|----------|
| `Name must be at least 2 characters` | Provide a name with minimum 2 characters |
| `Invalid email address` | Use a valid email format: user@example.com |
| `Password must be at least 6 characters` | Use a password with minimum 6 characters |
| `Email already exists` | Use a different email or login if already registered |

---

## Performance Optimization

### Query Optimization
- Indexes on `professor`, `startTime`, and `slot` fields
- Avoid N+1 queries using `.populate()` in Mongoose
- Limit response data to necessary fields

### Best Practices
1. **Batch Operations** - Combine multiple updates into transactions if possible
2. **Pagination** - Implement pagination for large result sets
3. **Caching** - Cache professor availability for better performance
4. **Rate Limiting** - Implement rate limiting to prevent abuse

---

## Common Integration Patterns

### Frontend Integration

**React Example:**
```javascript
// Login and store token
const login = async (email, password) => {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  localStorage.setItem('token', data.data.token);
  return data;
};

// Use token in requests
const getAppointments = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/appointments/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};
```

---

## Monitoring & Logging

### Health Check Script
```bash
#!/bin/bash
RESPONSE=$(curl -s http://localhost:5000/api/health)
if echo $RESPONSE | grep -q '"success":true'; then
  echo "✅ Server is healthy"
else
  echo "❌ Server is down"
fi
```

### Token Expiry Management
```javascript
// Check token expiry before requests
const isTokenExpired = (token) => {
  const decoded = JSON.parse(atob(token.split('.')[1]));
  return Date.now() >= decoded.exp * 1000;
};

// Refresh token if needed
if (isTokenExpired(token)) {
  // Redirect to login
}
```

---

# API Versioning

Current Version: **1.0.0**

### Version Strategy
- Semantic versioning: MAJOR.MINOR.PATCH
- Breaking changes increment MAJOR version
- New features increment MINOR version
- Bug fixes increment PATCH version

### Future Versions
- **v1.1.0** - Pagination, filtering, sorting on list endpoints
- **v1.2.0** - Email notifications for appointment reminders
- **v2.0.0** - Integration with calendar systems, recurring slots

---

# Support & Contact

For issues, questions, or feature requests:
- **Repository:** https://github.com/Satwik290/College-Appointment-System
- **Issues:** https://github.com/Satwik290/College-Appointment-System/issues

---

**Last Updated:** February 28, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅  
**License:** ISC

---

© 2026 College Appointment System. All rights reserved.