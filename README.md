# Customer Module

This project is a full-stack web application for managing customers. The backend is built with Node.js and Express, and the frontend is built with Vue.js. MongoDB is used as the database.

## Table of Contents

- [Project Setup](#project-setup)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Features](#features)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Project Setup

### Backend

- Node.js
- Express.js
- MongoDB

### Frontend

- Vue.js
- Vue Router
- Axios

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   git clone https://github.com/khagga926/customer-module.git

2. Navigate to the backend directory and install dependencies:
   cd backend
   npm install

3. Navigate to the frontend directory and install dependencies:
   cd frontend/customer-module-frontend
   npm install

### Running the Application

1. Start the backend server:
   cd backend
   npm start

2. Start the frontend development server:
   cd frontend
   npm run serve

### Features

- User authentication with JWT
- CRUD operations for customers
- File upload functionality for customer data, contact persons, and addresses
- Searchable and sortable customer list
- Edit and delete customer records
- Responsive design

## API Endpoints

- Authentication
  POST /api/auth/login - Log in a user.

- Customers
  GET /api/customers - Retrieve a list of customers.
  POST /api/customers - Add a new customer.
  PUT /api/customers/id - Update an existing customer.
  DELETE /api/customers/id - Delete a customer.

- Uploads
  POST /api/upload/customers - Upload customers via CSV.
  POST /api/upload/contact-persons - Upload contact persons via CSV.
  POST /api/upload/addresses - Upload addresses via CSV.
