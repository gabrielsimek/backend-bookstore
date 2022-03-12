const pool = require('../utils/pool');
module.exports = class Review {
  id;
  rating;
  reviewer;
  review;
  book;

  constructor(row) {
    this.id = row.id;
    this.rating = row.rating;
    this.reviewer = row.reviewer;
    this.review = row.review;
    this.book = row.book;
  }

  static async insert({ rating, reviewer, review, book }) {
    const { rows } = await pool.query(
      `
        INSERT INTO review(rating, reviewer, review, book)
        VALUES($1, $2, $3, $4)
        RETURNING *
        `,
      [rating, reviewer, review, book]
    );

    if (!rows[0]) return null;
    return new Review(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(`
      SELECT review.id,
          review.rating,
          review.review,
          to_jsonb(book.*) - 'released' - 'publisher_id' As book
      FROM review
          LEFT JOIN book ON book.id = review.book
      ORDER BY 
        review.rating 
      DESC
      LIMIT 100
    `);
    console.log('rows[0]', rows[0]);
    if (!rows[0]) return null;
    return rows.map((row) => new Review(row));
  }
};
