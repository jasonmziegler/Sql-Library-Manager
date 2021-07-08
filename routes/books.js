const db = require('../models');
const { Book } = db;

var express = require('express');
var router = express.Router();

/* GET users listing. */
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

module.exports = router;
