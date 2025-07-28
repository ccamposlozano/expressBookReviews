const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    const user = users.find((u) => username === u.username && password === u.password);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  
    const accessToken = jwt.sign(
      { username: user.username, role: "user" },
      "access",
      { expiresIn: "1h" }
    );
  
    req.session.authorization = { accessToken, username: user.username };
  
    return res.status(200).json({ message: "User logged in successfully" });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    // Get the username from the session
    const username = req.session.authorization?.username;
  
    // Validate
    if (!username) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review text is required" });
    }
  
    // Save or update review
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
  
    // Validate
    if (!username) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const userReview = books[isbn].reviews[username];
  
    if (!userReview) {
      return res.status(404).json({ message: "You have no review to delete" });
    }
  
    // Delete review
    delete books[isbn].reviews[username];
  
    return res.status(200).json({ message: "Review deleted successfully" });
  });
  
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
