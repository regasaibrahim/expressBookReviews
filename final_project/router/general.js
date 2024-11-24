const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let axios=require('axios')


public_users.post("/register", (req, res) => {
  let username=req.body.username
  let password=req.body.password
  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }
  if(!isValid(username)){
    users.push({
      username,
      password

    })
    res.send('User Registered Succussfuly')
  }else{
    res.status(402).send('User alredy Exist ')
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 6));
});

//Using Promise
public_users.get('/', (req, res) => {
  let book = new Promise((resolve, reject) => {
    if (books) {
      resolve(books); // Resolve the promise with the books array
    } else {
      reject('No books found'); // Reject the promise if no books are available
    }
  });

  // Handle the resolved promise
  book
    .then((data) => {
      res.send(data); // Send the data as the response
    })
    // Handle errors, in case the promise is rejected
    .catch((error) => {
      res.status(500).send({ message: error }); // Send the error message in the response
    });
});



// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let bookid = req.params.isbn;
  res.send(books[bookid]);
});

//using Promise
public_users.get("/isbn/:isbn", function (req, res) {
  let bookid = req.params.isbn;
  //promise for book details
  let bookdetail = new Promise((resolve, reject) => {
    const book = books[bookid];
    if (book) {
      resolve(book);
    } else {
      reject('Book not found');
    }
  })

  bookdetail.then((data)=>{
    res.send(JSON.stringify(data,null,6))
  }).catch((error) => {
    res.status(404).json({ message: error });
  });
});


// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let bookbyauthor = Object.values(books).filter((book) => {
    return book.author === author;
  });
  if (bookbyauthor.length > 0) {
    res.send(JSON.stringify(bookbyauthor, null, 6));
  } else {
    res.status(501).send(`There is no Book by ${author}`);
  }
});

//Using Promise 
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let author = req.params.author;
  
    
   let book= new Promise((resolve, reject) => {
      const booksByAuthor =Object.values(books).filter((book)=>{
        return book.author===author
      });
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject('No books found by this author');
      }
    })


      book.then((bookDetails) => {
        res.json(bookDetails);
      })
      .catch((error) => {
        res.status(404).json({ message: error });
      });
 
  
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let bookbytitle = Object.values(books).filter((book) => {
    return book.title === title;
  });
  if (bookbytitle.length > 0) {
    res.send(JSON.stringify(bookbytitle, null, 6));
  } else {
    res.status(301).send(`there is No book with title ${title}`);
  }
});

//using Promise 
// Route to get book details by title
public_users.get('/books/title/:title', (req, res) => {
  const title = req.params.title;
  
  new Promise((resolve, reject) => {
    const bookByTitle = Object.values(books).filter((b) => b.title.toLowerCase().includes(title.toLowerCase()));
    if (bookByTitle.length > 0) {
      resolve(bookByTitle);
    } else {
      reject('No books found with this title');
    }
  })
    .then((bookDetails) => {
      res.json(bookDetails);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});


//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let book = books[req.params.isbn];
  if (book) {
   return res.send(book.reviews)
  } else {
    res.status(302).send(`No Book By ISB ${req.params.isbn}`);
  }
});

module.exports.general = public_users;
