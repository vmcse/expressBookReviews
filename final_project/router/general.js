const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if username already exists
  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Register the user
  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );
  if (filteredBooks.length > 0) {
    res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );
  if (filteredBooks.length > 0) {
    res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "No reviews found for this book" });
  }
});

// Task 10: Get all books using async-await with Axios
public_users.get("/await-books", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Task 11: Get book by ISBN using async-await with Axios
public_users.get("/await-isbn/:isbn", async (req, res) => {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 12: Get books by author using async-await with Axios
public_users.get("/await-author/:author", async (req, res) => {
  const { author } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(404).json({ message: "No books found for the author" });
  }
});

// Task 13: Get books by title using async-await with Axios
public_users.get("/await-title/:title", async (req, res) => {
  const { title } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(404).json({ message: "No books found with the title" });
  }
});

module.exports.general = public_users;
