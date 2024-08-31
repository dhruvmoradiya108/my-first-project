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
      return res.status(400).json({ error: "Email already exists" });
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
      return res.status(401).json({ error: "Invalid email or password" });
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
      return res.status(400).json({ error: "Email already exists" });
    }

    // Insert new user into the database
    const insertQuery =
      "INSERT INTO user_data (name, email, password) VALUES (?, ?, ?)";
    db.query(insertQuery, [name, email, password], (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: "User registered successfully" });
    });
  });
})


app.post("/userLogin", (req, res) => {
  const { email, password } = req.body;

  // Check if the email exists
  const checkEmailQuery =
    "SELECT * FROM user_data WHERE email = ? AND password = ?";
  db.query(checkEmailQuery, [email, password], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Login successful
    res.status(200).json({ message: "Login successful", seller: result[0] });
  });
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
