const { Router } = require('express');
const Reviewer = require('../models/Reviewer');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const reviewer = await Reviewer.insert(req.body);
      res.json(reviewer);
    } catch (error) {
      next(error);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const reviewer = await Reviewer.getById(req.params.id);
      res.json(reviewer);
    } catch (error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const reviewers = await Reviewer.getAll();
      res.json(reviewers);
    } catch (error) {
      next(error);
    }
  })
  .put('/:id', async (req, res, next) => {
    try {
      const existingReviewer = await Reviewer.getById(req.params.id);

      if (!existingReviewer) {
        const error = new Error('existingReviewer does not exist');
        error.status = 400;
        throw error;
      }

      const name = req.body.name ?? existingReviewer.name;
      const company = req.body.company ?? existingReviewer.company;

      const updatedOrder = await Reviewer.update(req.params.id, {
        name,
        company,
      });

      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  })
  .delete('/:id', async (req, res, next) => {
    try {
      const existingReviewer = await Reviewer.getById(req.params.id);
      if (!existingReviewer.reviews.every(({ id }) => !id)) {
        const error = new Error('Reviewer cannot be deleted with reviews');
        error.status = 400;
        throw error;
      }

      const deletedReviewer = await Reviewer.delete(req.params.id);
      res.json(deletedReviewer);
    } catch (error) {
      next(error);
    }
  });
