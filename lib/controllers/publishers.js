const { Router } = require('express');
const Publisher = require('../models/Publisher');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const publisher = await Publisher.insert(req.body);
    res.json(publisher);
  } catch (error) {
    next(error);
  }
});
