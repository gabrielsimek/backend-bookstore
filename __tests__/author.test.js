const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Author = require('../lib/models/Author');

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
      pob: 'Tokyo'
    };

    const res = await request(app).post('/authors')
      .send(author);
    expect(res.body).toEqual({ ...author, id: expect.any(String) });
  });
});
