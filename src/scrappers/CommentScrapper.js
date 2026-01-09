// Placeholder comment processor. Implement specific comment scraping logic here.
class CommentProcessor {
  constructor({ apifyClient, db }) {
    this.apifyClient = apifyClient;
    this.db = db;
  }

  async process(links) {
    try {
      const response = await this.apifyClient.runPostScraper(links);
      const act_id = response && (response.data.actId || null);
      console.log(`Link processed at ${response.data.startedAt}, act_id=${act_id}, task_id=${response.data.id}`);
      return response;
   } catch (err) {
    console.error(`Failed processing ${links}:`, err && err.message ? err.message : err);
   }
  }
}

module.exports = CommentProcessor;