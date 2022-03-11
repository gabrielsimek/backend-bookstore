const { Router } = require('express');
const Publisher = require('../models/Publisher');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const publisher = await Publisher.insert(req.body);
      res.json(publisher);
    } catch (error) {
      next(error);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const publisher = await Publisher.getById(req.params.id);
      res.json(publisher);
    } catch (error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const publishers = await Publisher.getAll();
      res.json(publishers);
    } catch (error) {
      next(error);
    }
  });
