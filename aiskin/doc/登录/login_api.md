# AI Skincare System API Documentation

This documentation outlines the RESTful API endpoints for the AI Skincare System backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### User Management

#### Register User

Creates a new user account.

- **URL**: `/users/register`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

- **Success Response**:
  - **Code**: 201 Created
  - **Content**:

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "JWT_TOKEN",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
}
```

- **Error Responses**:
  - **Code**: 400 Bad Request
  - **Content**:

```json
{
  "success": false,
  "message": "Please provide name, email and password"
}
```

OR

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

#### Login User

Authenticates a user and returns a JWT token.

- **URL**: `/users/login`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Success Response**:
  - **Code**: 200 OK
  - **Content**:

```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "JWT_TOKEN",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
}
```

- **Error Responses**:
  - **Code**: 401 Unauthorized
  - **Content**:

```json
{
  "success": false,
  "message": "Incorrect email or password"
}
```

OR

```json
{
  "success": false,
  "message": "Please provide email and password"
}
```

#### Get Current User

Retrieves the profile of the currently authenticated user.

- **URL**: `/users/me`
- **Method**: `GET`
- **Authentication**: Required
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
}
```

- **Error Responses**:
  - **Code**: 401 Unauthorized
  - **Content**:

```json
{
  "success": false,
  "message": "You are not logged in. Please log in to access this resource."
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in a consistent format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Detailed error information (only in development environment)"
}
```

## Status Codes

- **200** - OK: Request succeeded
- **201** - Created: Resource was successfully created
- **400** - Bad Request: Invalid request or validation error
- **401** - Unauthorized: Authentication failed or user not authenticated
- **404** - Not Found: Resource not found
- **500** - Internal Server Error: Error on the server side

## Data Models

### User

```json
{
  "_id": "MongoDB ObjectId",
  "name": "String (required)",
  "email": "String (required, unique)",
  "password": "String (required, min 8 characters, not returned in responses)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Testing the API

You can use tools like Postman or cURL to test the API endpoints. Make sure to:

1. Start with the registration endpoint to create a user
2. Use the login endpoint to obtain a JWT token
3. Include the token in the Authorization header for protected endpoints

Example cURL commands:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get user profile (replace YOUR_TOKEN with the token received from login)
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
``` 