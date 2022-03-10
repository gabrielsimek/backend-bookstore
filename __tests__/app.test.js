const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Publisher = require('../lib/models/Publisher');

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
});
