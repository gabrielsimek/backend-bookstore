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
};
