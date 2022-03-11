const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Reviewer = require('../lib/models/Reviewer');
const Author = require('../lib/models/Author');
const Publisher = require('../lib/models/Publisher');
const Book = require('../lib/models/Book');
const Review = require('../lib/models/Review');

describe('backend-bookstore routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('adds a reviewer', async () => {
    const reviewer = {
      name: 'Roger Ebert',
      company: 'Siskel and Ebert',
    };

    const res = await request(app).post('/reviewers').send(reviewer);

    expect(res.body).toEqual({
      ...reviewer,
      id: expect.any(String),
    });
  });

  it('gets all reviewers', async () => {
    const reviewers = [
      {
        name: 'Roger Ebert',
        company: 'Siskel and Ebert',
      },
      {
        name: 'Casey Cameron',
        company: 'Alchemy Code Labs',
      },
    ];

    const expected = await Promise.all(
      reviewers.map((reviewer) => Reviewer.insert(reviewer))
    );

    const res = await request(app).get('/reviewers');

    expect(res.body).toEqual(expect.arrayContaining(expected));
  });

  it('gets a reviewer by id', async () => {
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

    const reviewer = await Reviewer.insert({
      name: 'Roger Ebert',
      company: 'Siskell and Ebert',
    });

    await Reviewer.insert({
      name: 'Marty',
      company: 'Alchemy'
    });

    const review1 = await Review.insert({
      rating: 5,
      reviewer: reviewer.id,
      review: 'Good Book',
      book: book1.id,
    });

    const review2 = await Review.insert({
      rating: 2,
      reviewer: reviewer.id,
      review: 'Bad Book',
      book: book2.id,
    });

    const res = await request(app).get(`/reviewers/${review1.id}`);

    expect(res.body).toEqual({
      id: expect.any(String),
      name: 'Roger Ebert',
      company: 'Siskell and Ebert',
      reviews: [
        {
          id: review1.id,
          rating: review1.rating,
          review: review1.review,
          book: { id: Number(book1.id), title: book1.title },
        },
        {
          id: review2.id,
          rating: review2.rating,
          review: review2.review,
          book: { id: Number(book2.id), title: book2.title },
        },
      ],
    });
  });
});
