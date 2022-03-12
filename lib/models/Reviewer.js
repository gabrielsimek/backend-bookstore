const pool = require('../utils/pool');
module.exports = class Reviewer {
  id;
  name;
  company;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.company = row.company;
    row.reviews ? (this.reviews = row.reviews) : null;
  }

  static async insert({ name, company }) {
    const { rows } = await pool.query(
      `
        INSERT INTO reviewer(name, company)
        VALUES($1, $2)
        RETURNING * 
    `,
      [name, company]
    );

    if (!rows[0]) return null;
    return new Reviewer(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM reviewer');

    if (!rows[0]) return null;
    return rows.map((row) => new Reviewer(row));
  }

  static async getById(id) {
    const reviewerQuery = await pool.query(
      'SELECT * FROM reviewer WHERE reviewer.id = $1',
      [id]
    );

    const reviewer = reviewerQuery.rows[0];
    if (!reviewer) return null;

    const { rows } = await pool.query(
      `
      SELECT review.id,
        review.review,
        review.rating,
        to_jsonb(book.*) - 'released' - 'publisher_id' AS book
      FROM reviewer
        LEFT JOIN review ON review.reviewer = reviewer.id
        LEFT JOIN book ON book.id = review.book
      WHERE reviewer.id = $1
    `,
      [id]
    );

    if (!rows[0]) return null;
    reviewer.reviews = rows;
    return new Reviewer(reviewer);
  }

  static async update(id, { name, company }) {
    const { rows } = await pool.query(
      `
      UPDATE reviewer
      SET name = $2, company = $3
      WHERE id = $1
      RETURNING *
    `,
      [id, name, company]
    );

    if (!rows[0]) return null;
    return new Reviewer(rows[0]);
  }
};
