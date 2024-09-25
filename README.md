# My First Angular and Node.js Project

**Description**:  
This project is built using Angular for the frontend and Node.js for the backend. It connects to a MySQL database to perform various operations such as user authentication, product display, cart management, and more.

## Features

- **User Authentication**: Login and signup system using Angular and Node.js.
- **Product Management**: Display products, handle cart, and checkout.
- **MySQL Database**: User data, product information, and orders are stored in a MySQL database.
- **Session Management**: Sessions are stored using MySQL.
- **Cart Functionality**: Add, remove, and update items in the cart.

## Technologies Used

| Frontend  | Backend   | Database   |
|-----------|-----------|------------|
| Angular 18| Node.js   | MySQL      |
| HTML5     | Express.js|            |
| CSS3      |           |            |

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git

2. Navigate to the backend directory:
    bash
    cd backend 

3.Install the dependencies:
    bash
    npm install

4.Configure the MySQL database credentials in .env:
    ```plaintext
    DB_HOST=your_host
    DB_USER=your_username
    DB_PASSWORD=your_password
    DB_DATABASE=your_database

5.Run the server: 
    ```bash
    nodemon index.js


### Frontend Setup

1.Navigate to the frontend directory:
    ```bash
    cd frontend

2.Install Angular dependencies:
    ```bash
    npm install

3.Start the Angular development server:
    ```bash
    ng serve