# Coursat API
 
A RESTful backend API for an online learning platform where instructors create courses and students enroll to learn.
 
Built as part of the **Information Technology Institute (ITI) Backend Development Course — 2026**.
 
---
 
## Author
 
**Abanoub Maqqar**
[LinkedIn](https://www.linkedin.com/in/abanoub-maqqar/)
 
---
 
## Table of Contents
 
- [About](#about)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Postman Collection](#postman-collection)
- [Screenshots](#screenshots)
- [License](#license)
---
 
## About
 
Coursat is a production-ready RESTful backend API for an online course platform. It supports two user roles — Instructor and Student. Instructors can create and manage courses and lessons, while students can browse, enroll, track progress, and comment on lessons.
 
---
 
## Tech Stack
 
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT + bcryptjs | Authentication and password hashing |
| Joi | Input validation |
| Nodemon | Development server |
 
---
 
## Features
 
### Core Features
 
- User registration and login with JWT authentication
- Two roles: Instructor and Student
- Instructors can create, update, and delete courses and lessons
- Students can enroll and unenroll from courses
- Students can add and delete comments on lessons
- Pagination and search on courses and lessons
- Input validation on all endpoints using Joi
- Centralized error handling middleware
- Role-based access control (RBAC)
### Technical Highlights
 
- RESTful API design with proper HTTP status codes
- Nested routes for lessons under courses
- MongoDB ObjectId validation on all ID parameters
- Populate instructor data in course responses
- Populate course data in enrollment responses
---
 
## Getting Started
 
### Prerequisites
 
- Node.js v18 or higher
- MongoDB installed locally or a MongoDB Atlas account
### Installation
 
```bash
# 1. Clone the repository
git clone https://github.com/Abanoubmaqqar19/coursat.git
cd coursat
 
# 2. Install dependencies
npm install
 
# 3. Set up environment variables
cp .env.example .env
# Open .env and fill in your values
 
# 4. Start development server
npm run dev
 
# 5. Start production server
npm start
```
 
The API will be running at `http://localhost:5000`
 
---
 
## Environment Variables
 
Copy `.env.example` to `.env` and fill in the values:
 
```env
PORT=5000
NODE_ENV=development
MONGOURL=mongodb://localhost:27017/coursat
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
```
 
---
 
## API Endpoints
 
### Auth
 
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register a new user | Public |
| POST | /api/auth/login | Login and get token | Public |
 
### Courses
 
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/courses | Get all courses | Public |
| GET | /api/courses?page=1&limit=10 | Paginated courses | Public |
| GET | /api/courses?search=node | Search by title | Public |
| GET | /api/courses/:id | Get single course | Public |
| POST | /api/courses | Create a course | Instructor |
| PUT | /api/courses/:id | Update a course | Instructor |
| DELETE | /api/courses/:id | Delete a course | Instructor |
 
### Lessons
 
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/courses/:courseId/lessons | Get all lessons | Public |
| GET | /api/courses/:courseId/lessons?page=1&limit=10 | Paginated lessons | Public |
| GET | /api/courses/:courseId/lessons/:id | Get single lesson | Public |
| POST | /api/courses/:courseId/lessons | Create a lesson | Instructor |
| PUT | /api/courses/:courseId/lessons/:id | Update a lesson | Instructor |
| DELETE | /api/courses/:courseId/lessons/:id | Delete a lesson | Instructor |
 
### Enrollments
 
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/enrollments/:courseId | Enroll in a course | Student |
| GET | /api/enrollments/my-courses | Get my enrolled courses | Student |
| DELETE | /api/enrollments/:courseId | Unenroll from a course | Student |
 
### Comments
 
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/comments/:lessonId | Add a comment | Student |
| GET | /api/comments/:lessonId | Get lesson comments | Public |
| DELETE | /api/comments/:id | Delete a comment | Student |
 
---
 
## Authentication
 
All protected routes require a JWT token in the `Authorization` header:
 
```
Authorization: Bearer YOUR_JWT_TOKEN
```
 
### Getting a Token
 
```bash
# Register
POST /api/auth/register
{
  "name": "Abanoub",
  "email": "abanoub@gmail.com",
  "password": "123456",
  "role": "instructor"
}
 
# Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
 
Use the token in subsequent requests:
 
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
 
---
 
## Error Responses
 
All errors follow this format:
 
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```
 
### HTTP Status Codes
 
| Code | Meaning |
|------|---------|
| 200 | OK — Request successful |
| 201 | Created — Resource created |
| 400 | Bad Request — Invalid input |
| 401 | Unauthorized — Missing or invalid token |
| 403 | Forbidden — Insufficient permissions |
| 404 | Not Found — Resource does not exist |
| 500 | Internal Server Error |
 
---
 
## Postman Collection
 
The full Postman collection is available in the `/postman` directory.
 
To use it:
 
1. Open Postman
2. Click Import
3. Select `postman/Coursat.postman_collection.json`
4. Set your environment variables (base_url, instructor_token, student_token)
5. Run the requests in order
---
 
## Screenshots
 
API test screenshots are available in `postman/screenshots/`.
 
---
 
## License
 
MIT License — feel free to use this project for learning purposes.
 
---
 
> Built with Node.js and MongoDB — ITI Backend Development Program 2026
