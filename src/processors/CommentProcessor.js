const ApifyClient = require("../apifyClient");
const config = require("../config");
const TaskRepository = require("../repositories/TaskRepository");
const CommentScrapper = require("../scrappers/CommentScrapper");
class CommentProcessor {
  constructor(linkRepository) {
    this.linkRepository = linkRepository;
  }
  async process() {
    try {
      const apifyClient = new ApifyClient(config.apify.token);
      const commentScrapper = new CommentScrapper({ apifyClient });
      const linkRecord = await this.linkRepository.getPosts(0, 2);
      if (!linkRecord || linkRecord.length === 0) {
        console.log(`No pending post found for processing.`);
        return;
      }
      const response = await commentScrapper.process(linkRecord);
      console.log(`Link processed: ${linkRecord.length}`);
      await this.logTasks(response, 'comment');
      await this.linkRepository.updateBulkStatus(linkRecord.map(link => link.id), 1);
    } catch (err) {
      console.error(`Failed processing`, err && err.message ? err.message : err);
    }
  }

  async logTasks(response, type = 'comment') {
    const taskRepository = new TaskRepository();
    await taskRepository.create(response, type);
  }
}

module.exports = CommentProcessor; 