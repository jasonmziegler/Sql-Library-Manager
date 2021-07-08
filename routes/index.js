const db = require('../models');
const { Book } = db;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  (async () => {
    try {
    const books = await Book.findAll();
    res.json(books);
    } catch (error) {
      console.log(error);
    }
  })();
  
  //res.render('index', { title: 'Express' });
});

module.exports = router;
