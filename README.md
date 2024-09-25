# My First Angular and Node.js Project

**Description:**
This project is built using Angular for the frontend and Node.js for the backend. It connects to a MySQL database to perform various operations such as user authentication, product display, cart management, and more.

## Features

- **User Authentication**: Login and signup system using Angular and Node.js.
- **Product Management**: Display products, handle cart and checkout.
- **MySQL Database**: User data, Product Information
and Orders are stored in a MySQL database.
- **Session Management**: Sessions are stored using MySQL.
- **Cart Functionality**: Add, remove and update items in the cart.

## Technologies Used in This Project 

| Frontend  | Backend   | Database |
|-----------|-----------|----------|
| Angular18 | Node.js   | MySQl    |
| HTML      | Express.js|          |
| CSS       |           |          |

## Installation

### Backend Setup 

1. Clone the repository:
   ```bash
   git clone https://github.com/dhruvmoradiya108/my-first-project

2. Navigate to the backend directory:
   ```bash
   cd backend

3. Install the dependencied:
   ```bash
   npm install

4. Configure the MySQL database credentials in .env:
   ```plaintext
   DB_HOST=your_host
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=your_database

5. Run the server: 
   ```bash
   nodemon index.js

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash 
   cd frontend

2. Install Angular dependecies:
   ```bash
   npm install

3. Start the Angular development server:
   ```bash 
   ng serve 