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
};