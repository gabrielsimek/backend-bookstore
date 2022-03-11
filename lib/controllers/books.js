const { Router } = require('express');
const Book = require('../models/Book');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const book = await Book.insert(req.body);
      const { authorIds } = req.body;
      // console.log('authorIds', authorIds);
      // console.log('book', book);
      await Promise.all(authorIds.map((id) => book.addAuthorById(id)));
      res.json(book);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res) => {
    const { id } = req.params;
    const book = await Book.getById(id);
    console.log('book', book);

    res.send(book);
  })

  .get('/', async (req, res) => {
    const books = await Book.getAll();
    res.send(books);
  });
