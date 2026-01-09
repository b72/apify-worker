const ApifyClient = require("../apifyClient");
const config = require("../config");
const TaskRepository = require("../repositories/TaskRepository");
const PageScrapper = require("../scrappers/PageScrapper");
class PageProcessor {
  constructor(linkRepository) {
    this.linkRepository = linkRepository;
  }
  async process() {
    try {
      const apifyClient = new ApifyClient(config.apify.token);
      const pageScrapper = new PageScrapper({ apifyClient });
      const linkRecord = await this.linkRepository.getPages(0, 2);
      if (!linkRecord || linkRecord.length === 0) {
        console.log(`No pending link found for processing.`);
        return;
      }
      const response = await pageScrapper.process(linkRecord);
      console.log(`Link processed: ${linkRecord.length}`);
      await this.logTasks(response, 'page');
      await this.linkRepository.updateBulkStatus(linkRecord.map(link => link.id), 1);
    } catch (err) {
      console.error(`Failed processing`, err && err.message ? err.message : err);
    }
  }

  async logTasks(response, type = 'page') {
    const taskRepository = new TaskRepository();
    await taskRepository.create(response, type);
  }
}

module.exports = PageProcessor; 