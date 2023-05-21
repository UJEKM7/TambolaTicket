# Project Setup Guide

# Install dependencies

npm install

# Create the environment file or replace the values in exisiting .env file with values you intend to use
    MONGO_URI=your_mongo_db_connection_string
    PORT=your_port
    JWT_SECRET=your_jwt_secret

# Start the application

npm run start

# APIS

    The following APIs are available in the project:

# 1. Create User API

- - Endpoint: POST /api/user/register

- - Description: Register user with email and password. Returns user on successful creation.

* - Request Body:
    Content-Type:applicaiton/json
    {
    "email": "your_email,
    "password:"your_password"
    }

# 2. Login User API

- - Endpoint: POST /api/user/login

- - Description: Login user with email and password. Returns token on the successful login.

* - Request Body:
    Content-Type:applicaiton/json
    {
    "email": "your_email,
    "password:"your_password"
    }
* - Header - Authorization: `Bearer ${your_token}`

# 3. Create Tambola Ticket Create API

- - Endpoint: POST /api/tambola/tickets

* - Description: Create Tambola tickets with a variable number of tickets. Returns a unique ID on the creation of the ticket.

* - Request Body:
    Content-Type:applicaiton/json
    {
    "numberOfTickets": 5
    }

# 4. Create Tambola Ticket Fetch API with id and Pagination

- - Endpoint: GET /api/tambola/:id

* - Description: Fetch all the ticket lists associated with the respective ID with pagination.

* - Query Parameters:
    page (optional): Page number for pagination. Default value: 1.
    limit (optional): Number of tickets per page. Default value: 10.

- - Example Request:
    GET /api/tambola/:id?page=1&limit=10
