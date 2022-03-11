const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Reviewer = require('../lib/models/Reviewer');
const Book = require('../lib/models/Book');
const Author = require('../lib/models/Author');
const Publisher = require('../lib/models/Publisher');

describe('backend-bookstore routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('adds a review', async () => {
    const publisher = await Publisher.insert({
      name: 'Penguin',
      city: 'New York',
      state: 'New York',
      country: 'United States',
    });

    const author = await Author.insert({
      name: 'Hithcock',
      dob: '4/27/1935',
      pob: 'Los Angeles',
    });

    const newBook = await Book.insert({
      title: 'Wind-up Bird Chronicle',
      publisherId: publisher.id,
      released: 1970,
    });
    await newBook.addAuthorById(author.id);

    const reviewer = await Reviewer.insert({
      name: 'Roger Ebert',
      company: 'Siskel and Ebert',
    });
    const review = {
      rating: 5,
      reviewer: reviewer.id,
      review: 'Good Book',
      book: newBook.id,
    };

    const res = await request(app).post('/reviews').send(review);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ...review,
      id: expect.any(String),
    });
  });
});
