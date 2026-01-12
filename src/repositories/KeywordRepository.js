const db = require('../db');
const config = require('../config');

class KeywordRepository {
  constructor() {
    this.table = 'keywords';
  }

  async getKeywords(status = null, limit = 10) {
   const sql = `SELECT * FROM ${this.table} WHERE status = ? ORDER BY created_at ASC, priority DESC LIMIT ${limit}`;
       const rows = await db.query(sql, [status]);
       return rows;
  }

  async updateBulkStatus(ids, status) {
    if (!ids || ids.length === 0) return;
    const sql = `UPDATE ${this.table} SET status = ?, updated_at = NOW() WHERE id IN (${ids.map(() => '?').join(',')})`;
    const params = [status, ...ids];
    await db.query(sql, params);
  }
}

module.exports = KeywordRepository;