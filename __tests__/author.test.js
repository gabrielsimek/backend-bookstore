const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Author = require('../lib/models/Author');
const Publisher = require('../lib/models/Publisher');
const Book = require('../lib/models/Book');

describe('backend-bookstore routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should post an author', async () => {
    const author = {
      name: 'Murakami',
      dob: '4/27/2019',
      pob: 'Tokyo',
    };

    const res = await request(app).post('/authors').send(author);
    expect(res.body).toEqual({ ...author, id: expect.any(String) });
  });

  it('should get all authors', async () => {
    const authors = [
      {
        name: 'Murakami',
        dob: '4/27/2019',
        pob: 'Tokyo',
      },
      {
        name: 'Hithcock',
        dob: '4/27/1935',
        pob: 'Los Angeles',
      },
    ];

    const expected = await Promise.all(
      authors.map((author) => Author.insert(author))
    );
    const res = await request(app).get('/authors');

    expect(res.body).toEqual(expect.arrayContaining(expected));
    expect(res.body).toHaveLength(2);
  });

  it('gets an author by id', async () => {
    const author = await Author.insert({
      name: 'Murakami',
      dob: '4/27/2019',
      pob: 'Tokyo',
    });

    await Author.insert({
      name: 'Hitchcock',
      dob: '4/27/1935',
      pob: 'Los Angeles',
    });

    const publisher1 = await Publisher.insert({
      name: 'Penguin',
      city: 'New York',
      state: 'New York',
      country: 'United States',
    });
    const publisher2 = await Publisher.insert({
      name: 'Random House',
      city: 'Portland',
      state: 'Oregon',
      country: 'United States',
    });

    const book1 = await Book.insert({
      title: 'Wind-up Bird Chronicle',
      publisherId: publisher1.id,
      released: 1970,
      authorIds: [author.id],
    });

    const book2 = await Book.insert({
      title: 'Dance, Dance, Dance',
      publisherId: publisher2.id,
      released: 1987,
      authorIds: [author.id],
    });

    await book1.addAuthorById(author.id);
    await book2.addAuthorById(author.id);

    const res = await request(app).get(`/authors/${author.id}`);

    // console.dir(res.body, { depth: null });
    expect(res.body).toEqual({
      name: 'Murakami',
      dob: '4/27/2019',
      pob: 'Tokyo',
      books: [
        {
          id: Number(book1.id),
          title: 'Wind-up Bird Chronicle',
          released: 1970,
        },
        {
          id: Number(book2.id),
          title: 'Dance, Dance, Dance',
          released: 1987,
        },
      ],
    });
  });

  //   {
  //     name,
  //     dob,
  //     pob,
  //     books: [{
  //       id,
  //       title,
  //       released
  //     }]
  // }
});
