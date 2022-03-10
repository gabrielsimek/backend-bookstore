const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Reviewer = require('../lib/models/Reviewer');

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
});
