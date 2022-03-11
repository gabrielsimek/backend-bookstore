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

    // console.log('author1', author1);
    // console.log('author2', author2);
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

  it('should be able to list books', async () => {
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

    // console.log('author1', author1);
    // console.log('author2', author2);
    const book = {
      title: 'Wind-up Bird Chronicle',
      publisherId: publisher.id,
      released: 1970,
      authorIds: [author1.id, author2.id],
    };

    await Book.insert(book);

    const res = await request(app).get('/books');

    expect(res.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          title: 'Wind-up Bird Chronicle',
          released: 1970,
          publisher: { id: 1, name: 'Penguin' },
        },
      ])
    );
  });

  it.only('should be able to list a book by id', async () => {
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

    const book = {
      title: 'Wind-up Bird Chronicle',
      publisherId: publisher.id,
      released: 1970,
      authorIds: [author1.id, author2.id],
    };

    const bookRes = await Book.insert(book);

    await Promise.all(book.authorIds.map((id) => bookRes.addAuthorById(id)));

    const res = await request(app).get(`/books/${bookRes.id}`);
    // console.log('res.body', res.body);
    // expect(res.body).toEqual({
    //   id: String(book.id),
    //   title: 'sample book',
    //   released: 1990,
    //   publishers: [null],
    //   reviews: [null],
    //   authors: [
    //     {
    //       id: expect.any(Number),
    //       name: 'sample author',
    //     },
    //   ],
    // });
  });
});
