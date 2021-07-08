const db = require('../models');
const { Book } = db;

var express = require('express');
var router = express.Router();

/* GET books listing. */
router.get('/', function(req, res, next) {
  (async () => {
    try {
    const books = await Book.findAll();
    //res.json(books);
    res.render('books', { title: 'Books' });
    } catch (error) {
      console.log(error);
    }
  })();
});

/* GET books/new page. */
router.get('/new', function(req, res, next) {
  res.render('books-new', { title: 'Add a New Book' });
});

/* GET books/id page. */
router.get('/:id', function(req, res, next) {
  res.render('book', { title: 'Update Book' });
});




module.exports = router;
