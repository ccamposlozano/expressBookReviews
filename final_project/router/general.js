const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const userExists = users.some((user) => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Add new user to the users array
    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Simulate a promise-based approach
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json({ message: "Error retrieving books" }));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const getBookByISBN = new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    });

    getBookByISBN
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(404).json({ message: err }));
});

const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        const authorBooks = [];
        for (let isbn in books) {
            const book = books[isbn];
            if (book.author === author) {
                authorBooks.push({ isbn, ...book });
            }
        }

        if (authorBooks.length > 0) {
            resolve(authorBooks);
        } else {
            reject("No books found for this author");
        }
    });
};

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    getBooksByAuthor(author)
        .then((books) => res.status(200).json(books))
        .catch((err) => res.status(404).json({ message: err }));
});


const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
        const titleBooks = [];
        for (let isbn in books) {
            const book = books[isbn];
            if (book.title === title) {
                titleBooks.push({ isbn, ...book });
            }
        }

        if (titleBooks.length > 0) {
            resolve(titleBooks);
        } else {
            reject("No books found for this title");
        }
    });
};


public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    getBooksByTitle(title)
        .then((books) => res.status(200).json(books))
        .catch((err) => res.status(404).json({ message: err }));
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;
    let book = books[isbn];

    if (book) {
        res.send(book.reviews);
    }
    else {
        res.status(404).json({ message: "Reviews not found" });
    }

});

module.exports.general = public_users;
