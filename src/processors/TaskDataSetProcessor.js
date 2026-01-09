const config = require("../config");
const ApifyClient = require("../apifyClient");

class TaskDataSetProcessor {
    constructor(taskRepository, linkRepository, commentRepository) {
        this.taskRepository = taskRepository;
        this.linkRepository = linkRepository;
        this.commentRepository = commentRepository;
        this.apifyClient = new ApifyClient(config.apify.token);
    }

    async process() {
        //try {
            const tasks = await this.taskRepository.getListByStatus('SUCCEEDED', 10);
            console.log(`Found ${tasks.length} succeeded tasks to process data sets.`);
            for (const task of tasks) {
                if (task.type === 'page') {
                    await this.processPageDataSet(task);
                }
                if (task.type === 'comment') {
                    await this.processCommentDataSet(task);
                }
                await this.taskRepository.updateById(task.id, { status: 'COMPLETED' });
            }
       // } catch (err) {
        //    console.error(`Failed processing`, err && err.message ? err.message : err);
       // }
    }

    async processPageDataSet(task) {
        const dataset = await this.apifyClient.getDatasetItems(task.id);
        console.log(`Processing dataset for task id=${task.id} with ${dataset.length} items.`);
        for (const item of dataset) {
            await this.linkRepository.create(
                item.facebookUrl,
                item.url,
                item,
            );
        }
    }

    async processCommentDataSet(task) {
        const response = await this.apifyClient.getDatasetItems(task.id);
        console.log(`Processing dataset for task id=${task.id} with ${response.length} items.`);
        this.commentRepository.create(response);
    }
}

module.exports = TaskDataSetProcessor;