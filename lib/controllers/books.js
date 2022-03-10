const { Router } = require('express');
const Book = require('../models/Book');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const book = await Book.insert(req.body);
    res.json(book);
  } catch (error) {
    next(error);
  }
});
