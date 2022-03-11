const pool = require('../utils/pool');

module.exports = class Publisher {
  id;
  name;
  city;
  state;
  country;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.city = row.city;
    this.state = row.state;
    this.country = row.country;
    this.books = row.books || [];
  }

  static async insert({ name, city, state, country }) {
    const { rows } = await pool.query(
      `
        INSERT INTO publisher(name, city, state, country)
        VALUES($1, $2, $3, $4)
        RETURNING *
      `,
      [name, city, state, country]
    );
    if (!rows[0]) return null;
    return new Publisher(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM publisher');

    if (!rows[0]) return null;
    return rows.map((row) => new Publisher(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(`
      SELECT
        publisher.*,
        jsonb_agg(to_jsonb(book) - 'released' - 'publisher_id') AS books
      FROM
        publisher
      LEFT JOIN 
        book ON publisher.id = book.publisher_id
      WHERE
        publisher.id = $1
      GROUP BY
        publisher.id
    `, [id]);
    
    if(!rows[0]) return null;
    return new Publisher(rows[0]);
  }
};
