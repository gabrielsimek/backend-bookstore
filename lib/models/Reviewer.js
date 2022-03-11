const pool = require('../utils/pool');
module.exports = class Reviewer {
  id;
  name;
  company;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.company = row.company;
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
    const { rows } = await pool.query(`
      SELECT review.id,
        review.review,
        review.rating,
        to_jsonb(book.*) - 'released' - 'publisher_id' AS book
      FROM reviewer
        LEFT JOIN review ON review.reviewer = reviewer.id
        LEFT JOIN book ON book.id = review.book
      WHERE reviewer.id =1
    `, [id]);

    const reviews = rows[0];
    if (!reviews) return null;

    // next query
  }
};
