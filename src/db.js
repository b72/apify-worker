const mysql = require('mysql2/promise');
const Config = require('./config');

class DB {
  constructor() {
    this.pool = mysql.createPool({
      host: Config.db.host,
      port: Config.db.port,
      user: Config.db.user,
      password: Config.db.password,
      database: Config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async query(sql, params) {
    const [rows] = await this.pool.query(sql, params);
    return rows;
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = new DB();