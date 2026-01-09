const db = require('../db');
const config = require('../config');
const crypto = require('crypto');

const md5 = (str) => crypto.createHash('md5').update(str).digest('hex');


class CommentRepository {
    constructor() {
        this.table = 'comments';
    }

    async create(data) {
        // Support both single insert and bulk insert
        const isArray = Array.isArray(data);
        const comments = isArray ? data : [data];

        if (comments.length === 0) return;

        const placeholders = comments.map(() => '(?, ?, ?, NOW(), NOW())').join(', ');
        const params = [];

        comments.forEach(comment => {
            params.push(
                comment.text,
                md5(comment.facebookUrl),
                JSON.stringify(comment || {})
            );
        });

        const sql = `INSERT INTO ${this.table} (text_content, link_hash, meta_data, created_at, updated_at)
              VALUES ${placeholders}`;
        return db.query(sql, params);
    }
}
module.exports = CommentRepository;