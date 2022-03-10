const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Book = require('../lib/models/Book');
const Publisher = require('../lib/models/Publisher');
const Author = require('../lib/models/Author');

describe('backend-bookstore routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('posts a book and adds authors', async () => {
    const publisher = await Publisher.insert({
      name: 'Penguin',
      city: 'New York',
      state: 'New York',
      country: 'United States',
    });

    const author1 = await Author.insert({
      name: 'Murakami',
      dob: '4/27/2019',
      pob: 'Tokyo',
    });

    const author2 = await Author.insert({
      name: 'Hithcock',
      dob: '4/27/1935',
      pob: 'Los Angeles',
    });

    console.log('author1', author1);
    console.log('author2', author2);
    const book = {
      title: 'Wind-up Bird Chronicle',
      publisherId: publisher.id,
      released: 1970,
      authorIds: [author1.id, author2.id],
    };

    const res = await request(app).post('/books').send(book);

    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'Wind-up Bird Chronicle',
      // publisher: []
      publisherId: publisher.id,
      released: 1970,
      authors: [
        { id: author1.id, name: author1.name },
        { id: author2.id, name: author2.name },
      ],
    });
  });
});
