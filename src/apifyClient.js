const axios = require('axios');

class ApifyClient {
  constructor(token) {
    this.token = token;
  }

  async runPageScraper(startUrls = [], opts = {}) {
    const endpoint = 'https://api.apify.com/v2/acts/apify~facebook-posts-scraper/runs';

    // support input as array of url strings OR array of objects like { url, crawl_config }
    let urls = [];
    let crawlConfig = {};
    if (Array.isArray(startUrls) && startUrls.length > 0 && typeof startUrls[0] === 'object') {
      urls = startUrls.map(s => (s && s.url) || '').filter(Boolean);
      const first = startUrls.find(s => s && s.crawl_config);
      if (first) crawlConfig = first.crawl_config || {};
    } else {
      urls = (startUrls || []).filter(Boolean);
    }

    const body = Object.assign({
      startUrls: urls.map(u => ({ url: u })),
      resultsLimit: opts.resultsLimit || (crawlConfig.resultsLimit !== undefined ? crawlConfig.resultsLimit : 2),
      captionText: opts.captionText !== undefined ? opts.captionText : (crawlConfig.captionText !== undefined ? crawlConfig.captionText : false)
    }, opts.extra || {});

    const headers = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const res = await axios.post(endpoint, body, { headers, timeout: opts.timeout || 120000 });
    return res.data;
  }


  async runPostScraper(startUrls = [], opts = {}) {
    const endpoint = 'https://api.apify.com/v2/acts/apify~facebook-comments-scraper/runs';

    // support input as array of url strings OR array of objects like { url, crawl_config }
    let urls = [];
    let crawlConfig = {};
    if (Array.isArray(startUrls) && startUrls.length > 0 && typeof startUrls[0] === 'object') {
      urls = startUrls.map(s => (s && s.url) || '').filter(Boolean);
      const first = startUrls.find(s => s && s.crawl_config);
      if (first) crawlConfig = first.crawl_config || {};
    } else {
      urls = (startUrls || []).filter(Boolean);
    }

    const body = Object.assign({
      startUrls: urls.map(u => ({ url: u })),
      resultsLimit: opts.resultsLimit || (crawlConfig.resultsLimit !== undefined ? crawlConfig.resultsLimit : 2),
      includeNestedComments: opts.includeNestedComments !== undefined ? opts.includeNestedComments : (crawlConfig.includeNestedComments !== undefined ? crawlConfig.includeNestedComments : true),
      viewOption: opts.viewOption !== undefined ? opts.viewOption : (crawlConfig.viewOption !== undefined ? crawlConfig.viewOption : 'RANKED_UNFILTERED')
    }, opts.extra || {});

    const headers = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const res = await axios.post(endpoint, body, { headers, timeout: opts.timeout || 120000 });
    return res.data;
  }

  async runKeywordsScraper(keyword, opts = {}) {
    const endpoint = 'https://api.apify.com/v2/acts/danek~facebook-search-ppr/runs';

    const params = [
      'max_posts',
      'search_type',
      'recent_posts',
      'start_date',
      'end_date',
      'location'
    ]
    const query = { keyword: keyword.keyword };
    for (const p of params) {
      if (keyword.crawl_config[p] !== undefined && keyword.crawl_config[p] !== null) {
        query[p] = keyword.crawl_config[p];
      }
    }
    const body = Object.assign({
      ...query
    }, opts.extra || {});

    const headers = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const res = await axios.post(endpoint, body, { headers, timeout: opts.timeout || 120000 });
    console.log(body, headers, res);

    return res.data;

  }
  async getRunStatus(actorId, runId) {
    const endpoint = `https://api.apify.com/v2/acts/${actorId}/runs/${runId}`;
    const headers = {};
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const res = await axios.get(endpoint, { headers });
    return res.data;
  }

  async getDatasetItems(runId) {
    const endpoint = `https://api.apify.com/v2/actor-runs/${runId}/dataset/items`;
    const headers = {};
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const res = await axios.get(endpoint, { headers });
    return res.data;
  }

}

module.exports = ApifyClient;