const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Book = require('../lib/models/Book');
const Publisher = require('../lib/models/Publisher');

describe('backend-bookstore routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('posts a book', async () => {
    const publisher = await Publisher.insert({
      name: 'Penguin',
      city: 'New York',
      state: 'New York',
      country: 'United States',
    });

    const book = {
      title: 'Wind-up Bird Chronicle',
      publisher: publisher.id,
      released: 1970,
    };

    const res = await request(app).post('/books').send(book);

    expect(res.body).toEqual({ ...book, id: expect.any(String) });
  });
});
