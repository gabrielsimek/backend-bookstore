const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Reviewer = require('../lib/models/Reviewer');
const Book = require('../lib/models/Book');
const Author = require('../lib/models/Author');
const Publisher = require('../lib/models/Publisher');
const Review = require('../lib/models/Review');

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

  it.only('gets all 100 highest reviews', async () => {
    const publishers = [...Array(5)].map((_, i) => ({
      name: `publisher ${i + 1}`,
      city: `city ${i + 1}`,
      state: `state ${i + 1}`,
      country: `country ${i + 1}`,
    }));

    const publisherRes = await Promise.all(
      publishers.map((publisher) => Publisher.insert(publisher))
    );

    const authors = [...Array(5)].map((_, i) => ({
      name: `author ${i + 1}`,
      dob: new Date().toLocaleDateString('en-US'),
      pob: `pob ${i + 1}`,
      country: `country ${i + 1}`,
    }));

    const authorsRes = await Promise.all(
      authors.map((author) => Author.insert(author))
    );
 
    const books = [...Array(10)].map((_, i) => ({
      title: `title ${i + 1}`,
      publisherId: publisherRes[Math.floor(Math.random() * 5)].id,
      released: `199${i + 1}`,
      authorIds: [authorsRes[Math.floor(Math.random() * 5)]].id,
    }));
    const booksRes = await Promise.all(books.map((book) => Book.insert(book)));

    await Promise.all(
      booksRes.map((book) => book.addAuthorById(Math.floor(Math.random() * 5)))
    );
    const reviewers = [...Array(20)].map((_, i) => ({
      name: `reviewer ${i + 1}`,
      company: `compnay ${i + 1}`,
    }));

    const reviewersRes = await Promise.all(
      reviewers.map((reviewer) => Reviewer.insert(reviewer))
    );

    let reviewerCount = 0;
    
    const reviews = [...Array(150)].map((_, i) => {
      reviewerCount++;
      if (reviewerCount > 14) reviewerCount = 0;
      const stars = Math.ceil(Math.random() * 5);
      return {
        rating: stars,
        reviewer: reviewersRes[reviewerCount].id,
        review: `Review # ${i + 1}, book was ${stars > 3 ? 'good' : 'bad'}`,
        book: authorsRes[Math.floor(Math.random() * 5)].id,
      };
    });

    const reviewsRes = await Promise.all(
      reviews.map((review) => Review.insert(review))
    );

    //   [{
    //     id,
    //     rating,
    //     review,
    //     book: { id, title }
    // }]
  });
});
