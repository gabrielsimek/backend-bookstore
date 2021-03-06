const express = require('express');

const app = express();

// Built in middleware
app.use(express.json());

// App routes
app.use('/authors', require('./controllers/authors'));
app.use('/books', require('./controllers/books'));
app.use('/publishers', require('./controllers/publishers'));
app.use('/reviewers', require('./controllers/reviewers'));
// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
