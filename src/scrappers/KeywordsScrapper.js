class KeywordsScrapper {
  constructor({ apifyClient, db }) {
    this.apifyClient = apifyClient;
    this.db = db;
  }

  async process(keyword) {
   //try {
      const response = await this.apifyClient.runKeywordsScraper(keyword);
      const act_id = response && (response.data.actId || null);
      console.log(`Link processed at ${response.data.startedAt}, act_id=${act_id}, task_id=${response.data.id}`);
      return response;
  // } catch (err) {
  //  console.error(`Failed processing ${keyword}:`, err && err.message ? err.message : err);
  // }
  }
}

module.exports = KeywordsScrapper;