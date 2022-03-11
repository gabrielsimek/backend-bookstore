const pool = require('../utils/pool');

module.exports = class Author {
  id;
  name;
  dob;
  pob;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.dob = new Date(row.dob).toLocaleDateString('en-US');
    this.pob = row.pob;
    row.books ? (this.books = row.books) : null;
    // this.books = row.books || [];
  }

  static async insert({ name, dob, pob }) {
    const { rows } = await pool.query(
      `
      INSERT INTO author (name, dob, pob)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [name, dob, pob]
    );

    if (!rows[0]) return null;
    return new Author(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
    SELECT
      author.name,
      author.dob,
      author.pob,
      jsonb_agg(to_jsonb(book) - 'publisher_id') AS books
    FROM
      author
      LEFT JOIN author_book ON author_book.author_id = author.id
      LEFT JOIN book ON book.id = author_book.book_id
    WHERE
      author.id = $1
    GROUP BY
      author.id
    `,
      [id]
    );

    if (!rows[0]) return null;
    return new Author(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM author');

    if (!rows[0]) return null;
    return rows.map((row) => new Author(row));
  }
};
