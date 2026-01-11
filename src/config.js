const dotenv = require('dotenv');
dotenv.config();

class Config {
  constructor() {
    this.db = {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'forge'
    };
    this.apify = {
      token: process.env.APIFY_TOKEN || ''
    };

    this.app = {
      interval: process.env.PROCESS_INTERVAL ? parseInt(process.env.PROCESS_INTERVAL, 10) : 3000,
      post: {
        crawl_config: { resultsLimit: 10, includeNestedComments: false, viewOption: "RANKED_UNFILTERED" }
      },
      page:{
        crawl_config: { resultsLimit: 2, captionText: true }
      }
    };
    this.toSqlDatetime = dt => {
      if (!dt) return null;
      const d = new Date(dt);
      if (Number.isNaN(d.getTime())) return null;
      return d.toISOString().slice(0, 19).replace('T', ' ');
    };
  }
}

module.exports = new Config();