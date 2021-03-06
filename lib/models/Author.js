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
  }

  static async insert({ name, dob, pob }) {
    const { rows } = await pool.query(`
      INSERT INTO author (name, dob, pob)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [name, dob, pob]);

    if (!rows[0]) return null;
    return new Author(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM author');

    if (!rows[0]) return null;
    return rows.map(row => new Author(row));
  }
};
