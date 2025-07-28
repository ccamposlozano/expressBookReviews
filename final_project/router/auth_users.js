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
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
