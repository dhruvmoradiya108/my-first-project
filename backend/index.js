const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const md5 = require("md5");
const PORT = 5000;
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected successfully.");
});

const sessionStore = new MySQLStore({}, db.promise());

app.use(
  session({
    key: "session_id",
    secret: "xeseic",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res
      .status(401)
      .json({ error: "You must be logged in to access this resource" });
  }
};

// Logout route to destroy the session
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }
    res.clearCookie("session_id");
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// Seller Signup
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = md5(password);

  const checkEmailQuery = "SELECT * FROM seller_data WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.status(200).json({ error: "Email already exists" });
    }

    const insertQuery =
      "INSERT INTO seller_data (name, email, password) VALUES (?, ?, ?)";
    db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: "Seller registered successfully" });
    });
  });
});

// Seller Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = md5(password);

  const checkEmailQuery =
    "SELECT * FROM seller_data WHERE email = ? AND password = ?";
  db.query(checkEmailQuery, [email, hashedPassword], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(200).json({ error: "Invalid email or password" });
    }

    req.session.userId = result[0].id;
    req.session.user = result[0]; // Store user data in session
    res.status(200).json({ message: "Login successful", seller: result[0] });
  });
});

// User Signup
app.post("/userSignUp", (req, res) => {
  const { name, email, password } = req.body;

  const checkEmailQuery = "SELECT * FROM user_data WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.status(200).json({ error: "Email already exists" });
    }

    const insertQuery =
      "INSERT INTO user_data (name, email, password) VALUES (?, ?, ?)";
    db.query(insertQuery, [name, email, password], (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: "User registered successfully" });
    });
  });
});

// User Login
app.post("/userLogin", (req, res) => {
  const { email, password } = req.body;

  const checkEmailQuery =
    "SELECT * FROM user_data WHERE email = ? AND password = ?";
  db.query(checkEmailQuery, [email, password], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(200).json({ error: "Invalid email or password" });
    }

    req.session.userId = result[0].id;
    req.session.user = result[0];
    res.status(200).json({ message: "Login successful", user: result[0] });
  });
});

// Protected Route to Add Product
app.post("/products", isLoggedIn, (req, res) => {
  const { name, price, description, image, color, category, sellerName } =
    req.body;
  const product = {
    name,
    price,
    description,
    image,
    color,
    category,
    seller_id: req.session.userId, // Use session userId
    seller_name: sellerName,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const sql = "INSERT INTO products SET ?";
  db.query(sql, product, (err, result) => {
    if (err) {
      console.error("Error adding product:", err);
      return res
        .status(500)
        .json({ message: "Failed to add product", error: err.message });
    }
    res.status(200).json({ message: "Product added successfully", result });
  });
});

// Protected Route to Get Seller Products
app.get("/sellerProducts", isLoggedIn, (req, res) => {
  const sql = "SELECT * FROM products WHERE seller_id = ?";
  db.query(sql, [req.session.userId], (err, results) => {
    if (err) {
      console.error("Error fetching seller products:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }
    res.json(results);
  });
});

// Get All Products (Public)
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Delete Product (Protected)
app.delete("/products/:id", isLoggedIn, (req, res) => {
  const sql = "DELETE FROM products WHERE id = ? AND seller_id = ?";
  db.query(sql, [req.params.id, req.session.userId], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ message: "Error deleting product" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Product not found or not authorized" });
    }
    res.json({ message: "Product deleted successfully" });
  });
});

// Get Single Product
app.get("/products/:id", (req, res) => {
  const sql = "SELECT * FROM products WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

// Update Product (Protected)
app.put("/products/:id", isLoggedIn, (req, res) => {
  const sql = "UPDATE products SET ? WHERE id = ? AND seller_id = ?";
  db.query(
    sql,
    [req.body, req.params.id, req.session.userId],
    (err, result) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ message: "Error updating product" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Product not found or not authorized" });
      }
      res.json({ message: "Product updated successfully" });
    }
  );
});

// Add Item to Cart (Protected)
app.post("/cart", isLoggedIn, (req, res) => {
  const {
    productId,
    name,
    price,
    image,
    description,
    color,
    category,
    quantity,
  } = req.body;
  const cartItem = {
    product_id: productId,
    name,
    price,
    image,
    description,
    color,
    category,
    quantity,
    user_id: req.session.userId,
    added_at: new Date(),
  };

  const sql = "INSERT INTO cart SET ?";
  db.query(sql, cartItem, (err, result) => {
    if (err) {
      console.error("Error adding to cart:", err);
      return res
        .status(500)
        .json({ message: "Failed to add to cart", error: err.message });
    }
    res.status(200).json({ message: "Added to cart successfully", result });
  });
});

// Get Cart Items for Logged-in User
// app.get("/cart", isLoggedIn, (req, res) => {
//   const sql = "SELECT * FROM cart WHERE user_id = ?";
//   db.query(sql, [req.session.userId], (err, results) => {
//     if (err) {
//       console.error("Error fetching cart items:", err);
//       return res.status(500).json({ message: "Failed to fetch cart items" });
//     }
//     res.json(results);
//   });
// });

app.get("/cart", (req, res) => {
  const userId = req.query.userId;
  const sql = "SELECT * FROM cart WHERE userId = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching cart items:", err);
      return res
        .status(200)
        .json({ message: "Server Error: Unable to fetch cart items." });
    }
    res.json(results);
  });
});

// Remove Item from Cart (Protected)
app.delete("/cart/:id", isLoggedIn, (req, res) => {
  const sql = "DELETE FROM cart WHERE id = ? AND user_id = ?";
  db.query(sql, [req.params.id, req.session.userId], (err, result) => {
    if (err) {
      console.error("Error deleting cart item:", err);
      return res.status(500).json({ message: "Error deleting cart item" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Cart item not found or not authorized" });
    }
    res.json({ message: "Cart item deleted successfully" });
  });
});

// Place Order
app.post("/orders", (req, res) => {
  const order = req.body;
  const formattedDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  order.orderDate = formattedDate;

  const sql = "INSERT INTO orders SET ?";
  db.query(sql, order, (err, result) => {
    if (err) {
      console.error("Error placing order:", err);
      return res.status(500).json({ message: "Error placing order" });
    }
    console.log("Order placed:", result);
    res.status(200).json({ message: "Order placed" });
  });
});

// // Get Order List
app.get("/orders", (req, res) => {
  const userId = req.query.userId;

  const sql = "SELECT * FROM orders WHERE userId = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).send("Error fetching orders");
    }
    res.json(results);
  });
});

app.delete("/orders/:id", (req, res) => {
  const orderId = req.params.id;

  const sql = "DELETE FROM orders WHERE id = ?";
  db.query(sql, [orderId], (err, result) => {
    if (err) {
      console.error("Error deleting order:", err);
      return res.status(500).send("Error deleting order");
    }
    res.send("Order deleted");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
