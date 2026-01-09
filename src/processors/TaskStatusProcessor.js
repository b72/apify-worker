const ApifyClient = require("../apifyClient");
const config = require("../config");

class TaskStatusProcessor {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;   
  }
  async process() { 
    try {
      const apifyClient = new ApifyClient(config.apify.token);
      const tasks = await this.taskRepository.getListByStatus(['READY','RUNNING'], 1);
      console.log(`Found ${tasks.length} running tasks in READY status.`);
      for (const task of tasks) {
        const response = await apifyClient.getRunStatus(task.act_id, task.id);
        console.log(`Updating task id=${task.id} with status=${response.data.status} message=${response.data.statusMessage}`);
        await this.taskRepository.updateById(task.id, response.data);
      }
   } catch (err) {
      console.error(`Failed processing`, err && err.message ? err.message : err);
   }
  }
}

module.exports = TaskStatusProcessor;