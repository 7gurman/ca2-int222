# Student Project Submission API (CA2)

A RESTful API built with **Node.js**, **Express.js**, and **MongoDB** (via **Mongoose**) for managing student project submissions.

## Features

- Schema validation (required fields, string length, enum for status, unique registration number, regex format checks)
- Fully asynchronous (async/await) Mongoose operations
- Proper HTTP methods and status codes (200, 201, 400, 404, 409, 500)
- Centralized error handling for validation errors, duplicate keys, invalid IDs, and unexpected server errors

## Project Structure

```
student-project-api/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   └── projectController.js   # Business logic for each endpoint
├── models/
│   └── Project.js              # Mongoose schema + validation
├── routes/
│   └── projectRoutes.js       # Route definitions
├── server.js                  # App entry point
├── package.json
└── .env.example
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Copy `.env.example` to `.env` and adjust as needed:
   ```bash
   cp .env.example .env
   ```
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/studentProjectDB
   ```
   (You can point `MONGO_URI` at a local MongoDB instance or a MongoDB Atlas cluster.)

3. **Run MongoDB** locally (if not using Atlas):
   ```bash
   mongod
   ```

4. **Start the server**
   ```bash
   npm start
   # or, with auto-reload during development:
   npm run dev
   ```

   The API will run at `http://localhost:5000`.

## Data Model

| Field                | Type   | Rules                                                                 |
|-----------------------|--------|------------------------------------------------------------------------|
| `studentName`         | String | required, 2–100 characters                                            |
| `registrationNumber`  | String | required, unique, alphanumeric/dashes/slashes only                    |
| `projectTitle`        | String | required, 3–200 characters                                            |
| `technologyUsed`      | String | required                                                               |
| `submissionDate`      | Date   | required                                                               |
| `projectStatus`       | String | required, one of: `Pending`, `In Progress`, `Submitted`, `Approved`, `Rejected` (default: `Pending`) |

`createdAt` / `updatedAt` timestamps are added automatically.

## API Endpoints

Base URL: `/api/projects`

| # | Method | Endpoint                          | Description                              |
|---|--------|------------------------------------|-------------------------------------------|
| 1 | POST   | `/api/projects`                    | Add a new project submission              |
| 2 | GET    | `/api/projects`                    | Retrieve all project submissions          |
| 3 | GET    | `/api/projects/:id`                | Retrieve a project submission by ID       |
| 4 | PUT    | `/api/projects/:id`                | Update complete project submission details|
| 5 | PATCH  | `/api/projects/:id/status`         | Update only the project status            |
| 6 | DELETE | `/api/projects/:id`                | Delete a project submission               |
| 7 | GET    | `/api/projects/status/:status`     | Retrieve submissions by project status    |
| 8 | GET    | `/api/projects/technology/:tech`   | Retrieve submissions by technology used   |

### 1. Add a new project submission
`POST /api/projects`

Request body:
```json
{
  "studentName": "Asha Kumar",
  "registrationNumber": "REG-2023-045",
  "projectTitle": "Smart Attendance System",
  "technologyUsed": "React.js, Node.js, MongoDB",
  "submissionDate": "2026-07-01",
  "projectStatus": "Submitted"
}
```
- `201 Created` on success
- `400 Bad Request` on validation failure
- `409 Conflict` if `registrationNumber` already exists

### 2. Retrieve all project submissions
`GET /api/projects` → `200 OK`

### 3. Retrieve a project submission by ID
`GET /api/projects/:id`
- `200 OK`, `400` invalid ID format, `404` not found

### 4. Update complete project submission details
`PUT /api/projects/:id` — body should contain full/updated fields
- `200 OK`, `400` validation error / invalid ID, `404` not found, `409` duplicate registration number

### 5. Update only the project status
`PATCH /api/projects/:id/status`
```json
{ "projectStatus": "Approved" }
```
- `200 OK`, `400` missing/invalid status or ID, `404` not found

### 6. Delete a project submission
`DELETE /api/projects/:id`
- `200 OK`, `400` invalid ID, `404` not found

### 7. Retrieve submissions based on project status
`GET /api/projects/status/:status`
Example: `GET /api/projects/status/Approved`
- `200 OK`, `400` if status is not one of the allowed enum values

### 8. Retrieve projects based on a specific technology
`GET /api/projects/technology/:tech`
Example: `GET /api/projects/technology/React`
(Case-insensitive partial match, so `react` matches `React.js`, `React Native`, etc.)
- `200 OK`

## Response Format

All responses follow a consistent shape:

```json
{
  "success": true,
  "count": 3,
  "data": [ ... ]
}
```

Error responses:
```json
{
  "success": false,
  "message": "Project submission not found"
}
```

## Testing

You can test the endpoints using **Postman**, **Insomnia**, or `curl`, e.g.:

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Asha Kumar",
    "registrationNumber": "REG-2023-045",
    "projectTitle": "Smart Attendance System",
    "technologyUsed": "React.js, Node.js, MongoDB",
    "submissionDate": "2026-07-01",
    "projectStatus": "Submitted"
  }'
```
