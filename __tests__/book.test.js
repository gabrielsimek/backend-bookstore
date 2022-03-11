const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Book = require('../lib/models/Book');
const Publisher = require('../lib/models/Publisher');
const Author = require('../lib/models/Author');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');

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

    const book = {
      title: 'Wind-up Bird Chronicle',
      publisherId: publisher.id,
      released: 1970,
      authorIds: [author1.id, author2.id],
    };

    const res = await request(app).post('/books').send(book);
    // console.dir(res.body, { depth: null });
    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'Wind-up Bird Chronicle',
      publisher: {},
      // reviews: [],
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

  it('should be able to list a book by id', async () => {
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
    
    const authorIds = [author1.id, author2.id];
    const book = await Book.insert({
      title: 'Wind-up Bird Chronicle',
      publisherId: publisher.id,
      released: 1970,
      authorIds,
    });

    await Promise.all(authorIds.map((id) => book.addAuthorById(id)));

    const reviewer1 = await Reviewer.insert({
      name: 'Roger Ebert',
      company: 'Siskel and Ebert',
    });
    const reviewer2 = await Reviewer.insert({
      name: 'Gabriel S',
      company: 'Alchemy',
    });

    const review1 = await Review.insert({
      rating: 5,
      reviewer: reviewer1.id,
      review: 'Good Book',
      book: book.id,
    });

    const review2 = await Review.insert({
      rating: 2,
      reviewer: reviewer2.id,
      review: 'Bad Book',
      book: book.id,
    });

    const { body } = await request(app).get(`/books/${book.id}`);
    // console.log(body);
    // console.log(JSON.stringify(body, null, 4));
    // console.dir(body, { depth: null });

    expect(body).toEqual({
      id: expect.any(String),
      title: 'Wind-up Bird Chronicle',
      released: 1970,
      publisher: { name: 'Penguin', id: expect.any(Number) },
      reviews: expect.arrayContaining([
        {
          id: expect.any(String),
          rating: review1.rating,
          review: review1.review,
          reviewer: {
            id: expect.any(Number),
            name: reviewer1.name,
          },
        },
        {
          id: expect.any(String),
          rating: review2.rating,
          review: review2.review,
          reviewer: {
            id: expect.any(Number),
            name: reviewer2.name,
          },
        },
      ]),
      authors: expect.arrayContaining([
        {
          id: expect.any(Number),
          name: 'Hithcock',
        },
        {
          id: expect.any(Number),
          name: 'Murakami',
        },
      ]),
    });
  });
});

// {
//   id: '1',
//   title: 'Wind-up Bird Chronicle',
//   publisher: {
//     id: 1,
//     name: 'Penguin',
//   },
//   released: 1970,
//   authors: [
//     {
//       id: 1,
//       name: 'Murakami',
//     },
//     {
//       id: 2,
//       name: 'Hithcock',
//     },
//   ],
//   reviews: [
//     {
//       id: '1',
//       rating: 5,
//       review: 'Good Book',
//       reviewer: [
//         {
//           id: 1,
//           name: 'Roger Ebert',
//         },
//       ],
//     },
//     {
//       id: '2',
//       rating: 2,
//       review: 'Bad Book',
//       reviewer: [
//         {
//           id: 2,
//           name: 'Gabriel S',
//         },
//       ],
//     },
//   ],
// };
