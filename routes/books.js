const db = require('../models');
const { Book } = db;

var express = require('express');
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

// TODO: figure out how to write async routes, and post to routes. probably need to redo the project files course.

/* GET books listing.*/
router.get('/', asyncHandler( async (req, res, next) => {
    const books = await Book.findAll();
    //res.json(books);
    res.render('books', { title: 'Books', books });    
}));

/* GET books/new page. */
router.get('/new', function(req, res, next) {
  res.render('books-new', { title: 'Add a New Book' });
});

/* POST books/new page. */
router.post('/new', asyncHandler(async (req, res) => {
  
  console.log(req.body);
  const book = await Book.create(req.body);
  
  res.redirect("/books/" + book.id); // will eventually add article.id to path
}));

/* GET books/id page. */
router.get('/:id', asyncHandler( async (req, res, next) => {
  // use id to find book in db
  const book = await Book.findByPk(req.params.id);
  // pass book to render template
  if (book) {
    res.render('book', { book});
  } else {
    res.sendStatus(404);
  }
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
    if(error.name === "SequelizeValidationError") {
      book = await Article.build(req.body);
      book.id = req.params.id; // make sure correct article gets updated
      res.render("/books/"+req.params.id, { book, errors: error.errors})
    } else {
      throw error;
    }
  }
}));



module.exports = router;
