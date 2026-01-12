const ApifyClient = require("../apifyClient");
const config = require("../config");
const TaskRepository = require("../repositories/TaskRepository");
const KeywordsScrapper = require("../scrappers/KeywordsScrapper");
class KeywordProcessor {
    constructor(keywordRepository) {
        this.keywordRepository = keywordRepository;
    }
    async process() {
        //try {
            const apifyClient = new ApifyClient(config.apify.token);
            const keywordsScrapper = new KeywordsScrapper({ apifyClient });
            const keywordRecord = await this.keywordRepository.getKeywords(0, 2);
            if (!keywordRecord || keywordRecord.length === 0) {
                console.log(`No pending keyword found for processing.`);
                return;
            }
            for (const keyword of keywordRecord) {
                const response = await keywordsScrapper.process(keyword)
                //wait this.logTasks(response, 'keyword');
                //wait this.keywordRepository.updateBulkStatus(keywordRecord.map(keyword => keyword.id), 1);
            }

        //} catch (err) {
       //     console.error(`Failed processing`, err && err.message ? err.message : err);
       // }
    }

    async logTasks(response, type = 'comment') {
        const taskRepository = new TaskRepository();
        await taskRepository.create(response, type);
    }
}

module.exports = KeywordProcessor