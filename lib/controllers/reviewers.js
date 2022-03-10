const { Router } = require('express');
const Reviewer = require('../models/Reviewer');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const reviewer = await Reviewer.insert(req.body);

    res.json(reviewer);
  } catch (error) {
    next(error);
  }
});
