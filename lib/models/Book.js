const pool = require('../utils/pool');
// const Author = require('./Author');

module.exports = class Book {
  id;
  title;
  publisher;
  released;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.publisherId = row.publisher_id;
    this.released = row.released;
    this.authors = [];
  }
  static async insert({ title, publisherId, released }) {
    const { rows } = await pool.query(
      `
      INSERT INTO book (title, publisher_id, released)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [title, publisherId, released]
    );

    if (!rows[0]) return null;
    return new Book(rows[0]);
  }

  async addAuthorById(authorId) {
    const { rows } = await pool.query(
      `
    SELECT id, name 
      FROM author 
    WHERE id = $1`,
      [authorId]
    );
    const author = rows[0];

    if (!author) return null;
    const res = await pool.query(
      `
      INSERT INTO author_book(book_id, author_id)
      VALUES($1, $2)
      RETURNING *
    `,
      [this.id, authorId]
    );
    if (!res.rows[0]) return null;
    this.authors = [...this.authors, { id: author.id, name: author.name }];
    return this;
  }
};
