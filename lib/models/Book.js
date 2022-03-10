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
    this.publisher = row.publisher || {};
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

  static async getAll() {
    const { rows } = await pool.query(
      `SELECT book.id, book.title, book.released,
      (to_jsonb(publisher) - 'city' - 'state' - 'country') AS publisher
      FROM book
      LEFT JOIN publisher ON book.publisher_id = publisher.id`
    );
    const book = rows.map((row) => new Book(row));

    return book.map((item) => ({
      id: item.id,
      title: item.title,
      released: item.released,
      publisher: item.publisher,
    }));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
        SELECT
          book.id, book.title, book.released,
          jsonb_agg(to_jsonb(author) - 'dob' - 'pob') AS author,
          jsonb_agg(to_jsonb(publisher) - 'city' - 'state' - 'country') AS publisher,
        FROM book
        LEFT JOIN author_book
        ON author_book.book_id = book.id
        LEFT JOIN author
        ON author_book.author_id = author.id
        LEFT JOIN publisher
        ON publisher.id = book.publisher_id
        LEFT JOIN review
        ON book.id = review.book
        WHERE book.id=$1
        GROUP BY book.id
      `,
      [id]
    );

    if (!rows[0]) return null;

    //add second query to get reviews
    //https://dba.stackexchange.com/questions/69655/select-columns-inside-json-agg
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
