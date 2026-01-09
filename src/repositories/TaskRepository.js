const db = require('../db');
const config = require('../config');

class TaskRepository {
  constructor() {
    this.table = 'tasks';
  }

  async create(task, type) {
    // Accept either the full payload ({ data: { ... } }) or the data object itself
    const payload = task && task.data ? task.data : task || {};

    const id = payload.id;
    const actId = payload.actId || null;

    const startedAt = config.toSqlDatetime(payload.startedAt);
    const finishedAt = config.toSqlDatetime(payload.finishedAt);
    const status = payload.status || null;

    const sql = `INSERT INTO ${this.table} (id, type, act_id, started_at, finished_at, status, meta_data, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const params = [
      id,
      type,
      actId,
      startedAt,
      finishedAt,
      status,
      JSON.stringify(payload || {})
    ];
    return db.query(sql, params);
  }

  async updateById(id, fields = {}) {
    const sets = [];
    const params = [];
    if (fields.status !== undefined) {
      sets.push('status = ?');
      params.push(fields.status);
    }

    if (fields.finishedAt !== undefined) {
      sets.push('finished_at = ?');
      params.push(config.toSqlDatetime(fields.finishedAt));
    }

    sets.push('updated_at = NOW()');
    params.push(id);

    const sql = `UPDATE ${this.table} SET ${sets.join(', ')} WHERE id = ?`;
    return db.query(sql, params);
  }

  async getListByStatus(status = 'SUCCEEDED', limit = 10) {
    if (status && !Array.isArray(status)) {
      status = [status];
    }
    const placeholders = status.map(() => '?').join(', ');
    const sql = `SELECT * FROM ${this.table} WHERE status IN (${placeholders}) LIMIT ?`;
    const rows = await db.query(sql, [...status, limit]);
    return rows;
  }
}

module.exports = TaskRepository;