const db = require('../models');
const { Book } = db;

var express = require('express');
const book = require('../models/book');
var router = express.Router();

/* Handler function to wrap each route. from Treehouse video https://teamtreehouse.com/library/create-entries*/
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(error) {
      res.status(500).send(error);
    }

  }
}

/* GET books listing.*/
router.get('/', asyncHandler( async (req, res, next) => {
    const books = await Book.findAll();
    res.render('books', { title: 'Books', books });    
}));

/* GET books/new page. */
router.get('/new', function(req, res, next) {
  res.render('new-book', { title: 'Add a New Book' });
});

/* POST books/new page. */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  console.log(req.body);
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id); 
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      res.render("books-new", { book , errors: error.errors, title: 'Add a New Book' });
    } else {
      throw error;
    }
  }
}));

/* GET books/id page. */
router.get('/:id', asyncHandler( async (req, res, next) => {
  // use id to find book in db
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('book', { book });
    } else {
    console.log('Book request else statement called books.js line55');
    const err = new Error();
    err.message = '404 Page Not Found'
    err.status = 404;
    next(err);
    //res.sendStatus(404);
    }
    
  } catch(error)  {
    
    throw error;
  }
  
  // pass book to render template
  //   if (book) {
  //   res.render('book', { book });
  // } else {
  //   //res.sendStatus(404);
  //   const err = new Error();
  //   err.message = '404 Page Not Found'
  //   err.status = 404;
  //   //res.render('page-not-found', {title: 'Page Not Found'});
  //   throw err;
  // }
}));

/* POST books/id route. */
router.post('/:id', asyncHandler( async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  } catch(error) {
    if (error.name === "SequelizeValidationError") {
      res.render("book", { book , errors: error.errors, title: book.title })
    } else {
      throw error;
    }
  }
}));

/* DELETE books/id/delete route */
router.post('/:id/delete', asyncHandler( async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
