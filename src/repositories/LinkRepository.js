const db = require('../db');
const crypto = require('crypto');
const config = require('../config');

const md5 = (str) => crypto.createHash('md5').update(str).digest('hex');

class LinkRepository {
  constructor() {
    this.table = 'links';
  }

  async getPages(status = 0, limit = 10) {
    const sql = `SELECT id, hash, url, type, status, crawl_config FROM ${this.table} WHERE type = 'page' AND status = ? ORDER BY created_at ASC, priority DESC LIMIT ${limit}`;
    const rows = await db.query(sql, [status]);
    return rows;
  }

  async getPosts(status = 0, limit = 10) {
    const sql = `SELECT id, hash, url, type, status, crawl_config FROM ${this.table} WHERE type = 'post' AND status = ? ORDER BY created_at ASC, priority DESC LIMIT ${limit}`;
    const rows = await db.query(sql, [status]);
    return rows;
  }

  async findByBatchId(batchId, status=0) {
    const sql = `SELECT * FROM ${this.table} WHERE batch_id = ? AND status = ? order by priority desc`;
    return db.query(sql, [batchId], [status]);
  }

  async getOne(status = 0) {
    const sql = `SELECT id, hash, url, type, status, crawl_config FROM ${this.table} WHERE status = ? ORDER BY created_at ASC, priority DESC LIMIT 1`;
    const rows = await db.query(sql, [status]);
    return rows;
  }
  async updateStatusByHash(hash, status) {
    const sql = `UPDATE ${this.table} SET status = ?, no_of_visits = IFNULL(no_of_visits, 0) + 1 WHERE hash = ?`;
    return db.query(sql, [status, hash]);
  }

  async updateBulkStatus(linkIds, status) {
    if (!Array.isArray(linkIds) || linkIds.length === 0) return;
    const placeholders = linkIds.map(() => '?').join(', ');
    const sql = `UPDATE ${this.table} SET no_of_visits = IFNULL(no_of_visits, 0) + 1, status = ? WHERE id IN (${placeholders})`;
    return db.query(sql, [status, ...linkIds]);
  }

  async create(facebookUrl, url, meta_data={}) {
    const hash = md5(facebookUrl);
    const link = await this.getByHash(hash);
    const sql = `INSERT INTO ${this.table} (url, hash, type, crawl_config, meta_data, priority, parent_id, user_id, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    return db.query(sql, [
      url,
      md5(url),
      'post',
      config.app.post.crawl_config ? JSON.stringify(config.app.post.crawl_config) : null,
      JSON.stringify(meta_data || {}),
      0,
      link ? link.id : null,
      link && link.user_id ? link.user_id : null,
      0
    ]);
  }

  async getByHash(hash) {
    const sql = `SELECT * FROM ${this.table} WHERE hash = ? LIMIT 1`;
    const rows = await db.query(sql, [hash]);
    return rows[0];
  }
}

module.exports = LinkRepository;