const { Router } = require('express');
const Book = require('../models/Book');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const book = await Book.insert(req.body);

      const { authorIds } = req.body;
      await Promise.all(authorIds.map((id) => book.addAuthorById(id)));

      res.json(book);
    } catch (error) {
      next(error);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const book = await Book.getById(id);
      
      res.json(book);
    } catch (error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const books = await Book.getAll();
      res.send(books);
    } catch (error) {
      next(error);
    }
  });
