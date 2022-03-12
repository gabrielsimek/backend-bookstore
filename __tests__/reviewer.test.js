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
      company: 'Alchemy',
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

  it('updates a reviewer', async () => {
    const reviewer1 = await Reviewer.insert({
      name: 'Roger Ebert',
      company: 'Siskell and Ebert',
    });

    const reviewer2 = await Reviewer.insert({
      name: 'Gabriel S',
      company: 'Alchemy',
    });

    const res1 = await request(app)
      .put(`/reviewers/${reviewer1.id}`)
      .send({ name: 'Roger' });

    const res2 = await request(app)
      .put(`/reviewers/${reviewer2.id}`)
      .send({ name: 'Casey', company: 'ACL' });

    expect(res1.body).toEqual({
      id: reviewer1.id,
      name: 'Roger',
      company: reviewer1.company,
    });

    expect(res2.body).toEqual({
      id: reviewer2.id,
      name: 'Casey',
      company: 'ACL',
    });
  });

  it('removes a reviewer', async () => {
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

    const reviewer1 = await Reviewer.insert({
      name: 'Roger Ebert',
      company: 'Siskell and Ebert',
    });

    const reviewer2 = await Reviewer.insert({
      name: 'Marty',
      company: 'Alchemy',
    });

    await Review.insert({
      rating: 5,
      reviewer: reviewer1.id,
      review: 'Good Book',
      book: book1.id,
    });

    await Review.insert({
      rating: 2,
      reviewer: reviewer1.id,
      review: 'Bad Book',
      book: book2.id,
    });

    const reviewer1Res = await request(app).delete(
      `/reviewers/${reviewer1.id}`
    );

    const reviewer2Res = await request(app).delete(
      `/reviewers/${reviewer2.id}`
    );

    const allReviewers = await Reviewer.getAll();

    //Reviewer with reviews
    expect(reviewer1Res.status).toBe(400);
    expect(reviewer1Res.body).toEqual({
      message: 'Reviewer cannot be deleted with reviews',
      status: 400,
    });
    expect(allReviewers).toEqual(expect.arrayContaining([reviewer1]));
    //Reviewer with no reviews
    expect(reviewer2Res.body).toEqual(reviewer2);
    expect(allReviewers).toEqual(expect.not.arrayContaining([reviewer2]));
  });
});
