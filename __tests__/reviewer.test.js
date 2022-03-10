const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

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
});
