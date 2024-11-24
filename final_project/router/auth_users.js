const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  let valid = users.filter((user) => {
    return user.username === username;
  });
  //return true if user exist false otherwise
  return valid.length > 0;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  let ckeckuser = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return ckeckuser.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //geting user data from body req
  let username = req.body.username;
  let password = req.body.password;

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        username,
      },
      "access",
      { expiresIn: "1h" }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    res.send(`User ${username} have loged in successfuly`);
  } else {
    res.status(403).json({ message: `Can't Login User` });
  }
});

// Add a book review

regd_users.put("/auth/review/:isbn",(req, res) => {
  const bookId = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username; 


  
  const book = books[bookId];
  if (!book) {
    return res.status(404).send("Book not found");
  }

 
  if (!book.reviews) {
    book.reviews = {}; // Set reviews as an empty object
  }

 
  book.reviews[username] = review;

  res.status(200).send(`Review by ${username} for book "${book.title}" updated successfully.`);
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
  let user = req.user.username
  let bookid=req.params.isbn
  
  let book=books[bookid]
  if(!book){
    res.status(404).send('Book Not Found')
  }
  if(!book.review || !book.review[user]){
    res.send('No Review Yet!')
  }
  delete book.review[user]
})




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
