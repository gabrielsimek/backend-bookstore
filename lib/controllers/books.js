const { Router } = require('express');
const Book = require('../models/Book');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const book = await Book.insert(req.body);
    const { authorIds } = req.body;
    // console.log('authorIds', authorIds);
    // console.log('book', book);
    await Promise.all(authorIds.map((id) => book.addAuthorById(id)));
    // console.log('book', book);
    res.json(book);
  } catch (error) {
    next(error);
  }
});
