# Coursat API

A RESTful backend API for an online learning platform where instructors create courses and students enroll to learn.
 
---
 Built as part of the Information Technology Institute (ITI) Backend Development Program.
 
---
 
## Table of Contents
 
- About
- Tech Stack
- Features
- Project Structure
- Getting Started
- Environment Variables
- API Endpoints
- Authentication
---
 
## About
 
Coursat is a RESTful backend API for an online course platform. Instructors can create courses and lessons, while students can enroll, track progress, and comment on lessons.
 
---
 
## Tech Stack
 
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB + Mongoose
- Authentication: JWT + bcryptjs
- Validation: Joi
- Dev Tools: Nodemon
---
 
## Features
 
### Core
 
- User authentication (register + login)
- Two roles: Instructor and Student
- Instructors can create, update, delete courses and lessons
- Students can enroll and unenroll from courses
- Students can comment on lessons
- Pagination and search on courses and lessons
- Input validation on all endpoints
- Centralized error handling
### Extra
 
- Role-based access control
- ObjectId validation
- Populate instructor data in courses
- Populate course data in enrollments
---
 
## Project Structure
 
```
coursat/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── course.controller.js
│   │   ├── lesson.controller.js
│   │   ├── enrollment.controller.js
│   │   └── comment.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validator.js
│   │   └── globlalErrorMiddleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── course.model.js
│   │   ├── lesson.model.js
│   │   ├── enrollment.model.js
│   │   └── comment.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── course.routes.js
│   │   ├── lesson.routes.js
│   │   ├── enrollment.routes.js
│   │   └── comment.routes.js
│   └── validation/
│       ├── authValidation.js
│       ├── courseValidation.js
│       ├── lessonValidation.js
│       └── commentValidation.js
├── app.js
├── server.js
├── .env
├── .env.example
├── .gitignore
└── package.json
```
 
---
 
## Getting Started
 
### Prerequisites
 
- Node.js v18+
- MongoDB (local or Atlas)
### Installation
 
```bash
# 1. Clone the repo
git clone https://github.com/Abanoubmaqqar19/coursat.git
cd coursat
 
# 2. Install dependencies
npm install
 
# 3. Setup environment variables
cp .env.example .env
# Edit .env with your values
 
# 4. Run in development
npm run dev
 
# 5. Run in production
npm start
```
 
---
 
## Environment Variables
 
Create a .env file in the root directory based on .env.example:
 
```
PORT=5000
NODE_ENV=development
MONGOURL=mongodb://localhost:27017/coursat
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
```
 
---
 
## API Endpoints
 
### Auth
 
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
 
### Courses
 
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/courses | Get all courses | No |
| GET | /api/courses?page=1&limit=10 | Get courses with pagination | No |
| GET | /api/courses?search=node | Search courses by title | No |
| GET | /api/courses/:id | Get single course | No |
| POST | /api/courses | Create course | Instructor |
| PUT | /api/courses/:id | Update course | Instructor |
| DELETE | /api/courses/:id | Delete course | Instructor |
 
### Lessons
 
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/courses/:courseId/lessons | Get all lessons | No |
| GET | /api/courses/:courseId/lessons?page=1&limit=10 | Get lessons with pagination | No |
| GET | /api/courses/:courseId/lessons/:id | Get single lesson | No |
| POST | /api/courses/:courseId/lessons | Create lesson | Instructor |
| PUT | /api/courses/:courseId/lessons/:id | Update lesson | Instructor |
| DELETE | /api/courses/:courseId/lessons/:id | Delete lesson | Instructor |
 
### Enrollments
 
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/enrollments/:courseId | Enroll in course | Student |
| GET | /api/enrollments/my-courses | Get my enrolled courses | Student |
| DELETE | /api/enrollments/:courseId | Unenroll from course | Student |
 
### Comments
 
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/comments/:lessonId | Add comment on lesson | Student |
| GET | /api/comments/:lessonId | Get all comments on lesson | No |
| DELETE | /api/comments/:id | Delete comment | Student |
 
---
 
## Authentication
 
All protected routes require a JWT token in the Authorization header:
 
```
Authorization: Bearer YOUR_JWT_TOKEN
```
 
### How to get a token
 
```bash
# 1. Register
POST /api/auth/register
Body:
{
  "name": "Ahmed",
  "email": "ahmed@gmail.com",
  "password": "123456",
  "role": "instructor"
}
 
# 2. Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
 
# 3. Use token in next requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
 
---
 
## Error Responses
 
All error responses follow this format:
 
```json
{
  "success": false,
  "message": "Error message here"
}
```
 
### Status Codes
 
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |
 
---
 
## License
 
MIT
 
---
 
Built with Node.js — ITI Backend Development Course 2026
 ## Author
 
Abanoub Maqqar
 
## Connect with Me

- LinkedIn: [Abanoub Maqqar](https://www.linkedin.com/in/abanoubmaqqar19)
