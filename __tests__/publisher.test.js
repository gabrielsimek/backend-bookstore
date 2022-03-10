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
});
