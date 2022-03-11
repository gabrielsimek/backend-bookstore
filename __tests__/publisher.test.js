const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Publisher = require('../lib/models/Publisher');
const Author = require('../lib/models/Author');
const Book = require('../lib/models/Book');

describe('backend-bookstore routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('posts a publisher', async () => {
    const publisher = {
      name: 'Penguin',
      city: 'New York',
      state: 'New York',
      country: 'United States',
    };
    const res = await request(app).post('/publishers').send(publisher);

    expect(res.body).toEqual({
      ...publisher,
      id: expect.any(String),
    });
  });

  it('gets all publishers', async () => {
    const publishers = [
      {
        name: 'Penguin',
        city: 'New York',
        state: 'New York',
        country: 'United States',
      },
      {
        name: 'Random House',
        city: 'New York',
        state: 'New York',
        country: 'United States',
      },
    ];

    const expected = await Promise.all(
      publishers.map((publisher) => Publisher.insert(publisher))
    );

    const res = await request(app).get('/publishers');

    expect(res.body).toEqual(expect.arrayContaining(expected));
    expect(res.body.length).toBe(2);
  });

  
  it.only('gets a publisher by id', async () => {
  // { id, name, city, state, country, books: [{ id, title }] }
    const author = await Author.insert({
      name: 'Murakami',
      dob: '4/27/2019',
      pob: 'Tokyo',
    });

    const publisher = await Publisher.insert({
      name: 'Penguin',
      city: 'New York',
      state: 'New York',
      country: 'United States',
    });
    
    const book1 = await Book.insert({
      title: 'Wind-up Bird Chronicle',
      publisherId: publisher.id,
      released: 1970,
    });

    const book2 = await Book.insert({
      title: 'Infinite Jest',
      publisherId: publisher.id,
      released: 1970,
    });
    
    await book1.addAuthorById(author.id);
    await book2.addAuthorById(author.id);
    
    const res = await request(app).get(`/publishers/${publisher.id}`);

    expect(res.body).toEqual({
      id: expect.any(String), 
      name: 'Penguin', 
      city: 'New York', 
      state: 'New York', 
      country: 'United States',
      books: [
        { id: 1, title: 'Wind-up Bird Chronicle' },
        { id: 2, title: 'Infinite Jest' },
      ]
    });
  });
});
