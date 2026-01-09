class PageScrapper {
  constructor({ apifyClient}) {
    this.apifyClient = apifyClient;
  }
  async process(links) {
    try {
      const response = await this.apifyClient.runPageScraper(links);
      const act_id = response && (response.data.actId || null);
      console.log(`Link processed at ${response.data.startedAt}, act_id=${act_id}, task_id=${response.data.id}`);
      return response;
   } catch (err) {
    console.error(`Failed processing ${links}:`, err && err.message ? err.message : err);
   }
  }
}
module.exports = PageScrapper;