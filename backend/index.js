const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const md5 = require("md5");
const PORT = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "dHruv@108",
  database: "one_xero_eight",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected successfully.");
});

// FOR SELLER SIGNUP AND LOGIN
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  // Check if the email already exists
  const checkEmailQuery = "SELECT * FROM seller_data WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.status(200).json({ error: "Email already exists" });
    }

    // Insert new seller into the database
    const insertQuery =
      "INSERT INTO seller_data (name, email, password) VALUES (?, ?, ?)";
    db.query(insertQuery, [name, email, password], (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: "Seller registered successfully" });
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the email exists
  const checkEmailQuery =
    "SELECT * FROM seller_data WHERE email = ? AND password = ?";
  db.query(checkEmailQuery, [email, password], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(200).json({ error: "Invalid email or password" });
    }

    // Login successful
    res.status(200).json({ message: "Login successful", seller: result[0] });
  });
});

// FOR USER SIGNUP AND LOGIN

app.post("/userSignUp", (req, res) => {
  const { name, email, password } = req.body;

  // Check if the email already exists
  const checkEmailQuery = "SELECT * FROM user_data WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.status(200).json({ error: "Email already exists" });
    }

    // Insert new user into the database
    const insertQuery =
      "INSERT INTO user_data (name, email, password) VALUES (?, ?, ?)";
    db.query(insertQuery, [name, email, password], (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: "User registered successfully" });
    });
  });
});

app.post("/userLogin", (req, res) => {
  const { email, password } = req.body;

  // Check if the email exists
  const checkEmailQuery =
    "SELECT * FROM user_data WHERE email = ? AND password = ?";
  db.query(checkEmailQuery, [email, password], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(200).json({ error: "Invalid email or password" });
    }

    // Login successful
    res.status(200).json({ message: "Login successful", seller: result[0] });
  });
});

// Add Product
app.post("/products", (req, res) => {
  // Destructure the incoming request body
  const {
    name,
    price,
    description,
    image,
    color,
    category,
    sellerId,
    sellerName,
  } = req.body;

  // Construct the product object
  const product = {
    name,
    price,
    description,
    image,
    color,
    category,
    seller_id: sellerId, // Ensure this matches your DB column name
    seller_name: sellerName, // Ensure this matches your DB column name
    created_at: new Date(),
    updated_at: new Date(),
  };

  // SQL query to insert the product
  const sql = "INSERT INTO products SET ?";

  // Execute the query
  db.query(sql, product, (err, result) => {
    if (err) {
      // Log the error for debugging purposes
      console.error("Error adding product:", err);

      // Send a 500 status with a detailed message
      return res
        .status(200)
        .json({ message: "Failed to add product", error: err.message });
    }

    // Send a success response
    res.status(200).json({ message: "Product added successfully", result });
  });
});

// Get Product List
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Delete Product
// app.delete("/products/:id", (req, res) => {
//   const sql = "DELETE FROM products WHERE id = ?";
//   db.query(sql, [req.params.id], (err, result) => {
//     if (err) throw err;
//     res.send("Product deleted");
//   });
// });

app.delete("/products/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM products WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, message: "Error deleting product" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(200)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
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

// Update Product
app.put("/products/:id", (req, res) => {
  const sql = "UPDATE products SET ? WHERE id = ?";
  db.query(sql, [req.body, req.params.id], (err, result) => {
    if (err) throw err;
    res.send("Product updated");
  });
});

app.post("/cart", (req, res) => {
  const { userId, productId, name, price, image, quantity } = req.body;

  const cartItem = {
    userId,
    productId,
    name,
    price,
    image,
    quantity,
  };

  const sql = "INSERT INTO cart SET ?";

  db.query(sql, cartItem, (err, result) => {
    if (err) {
      console.error("Error inserting item into cart:", err);
      return res
        .status(200)
        .json({ message: "Server Error: Unable to add item to cart." });
    }
    res.json({ message: "Item added to cart" });
  });
});

// Get Cart List
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

// Remove from Cart
app.delete("/cart/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM cart WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting item from cart:", err);
      return res
        .status(200)
        .json({ message: "Server Error: Unable to remove item from cart." });
    }
    res.json({ message: "Item removed from cart" });
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

// Get Order List
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
