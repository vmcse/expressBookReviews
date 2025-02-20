const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if user exists and password matches
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token and store in session
  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
  req.session.token = token;

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;

  // Check if the token is present and valid
  const token = req.session?.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, "secret_key");
    const username = decoded.username;

    // Check if review text is provided
    if (!review) {
      return res.status(400).json({ message: "Review text is required" });
    }

    // Check if book exists
    if (books[isbn]) {
      // Add or update the review
      books[isbn].reviews[username] = review;
      return res.status(200).json({
        message: "Review added/updated successfully",
        book: books[isbn],
      });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error in review route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  // Check if the token is present and valid
  const token = req.session?.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, "secret_key");
    const username = decoded.username;

    // Check if book and review exist
    if (books[isbn] && books[isbn].reviews[username]) {
      // Delete the review
      delete books[isbn].reviews[username];
      return res
        .status(200)
        .json({ message: "Review deleted successfully", book: books[isbn] });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error("Error in delete review route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
