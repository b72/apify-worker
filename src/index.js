#!/usr/bin/env node
const config = require('./config');
const PageProcessor = require('./processors/PageProcessor');
const TaskDataSetProcessor = require('./processors/TaskDataSetProcessor');
const TaskStatusProcessor = require('./processors/TaskStatusProcessor');
const CommentProcessor = require('./processors/CommentProcessor');
const LinkRepository = require('./repositories/LinkRepository');
const TaskRepository = require('./repositories/TaskRepository');
const CommentRepository = require('./repositories/CommentRepository');


async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const pageProcessor = new PageProcessor(
    new LinkRepository()
  );

  const commentProcessor = new CommentProcessor(
    new LinkRepository()
  );  

  const taskStatusProcessor = new TaskStatusProcessor(
    new TaskRepository()
  );
  const taskDataSetProcessor = new TaskDataSetProcessor(
    new TaskRepository(),
    new LinkRepository(),
    new CommentRepository()
  );

  while (true) {
    try {
      const runners = [
        pageProcessor.process(),
        commentProcessor.process(),
        taskStatusProcessor.process(),
        taskDataSetProcessor.process()
      ];
      const results = await Promise.allSettled(runners);
      const names = ['taskStatusProcessor', 'pageProcessor', 'commentProcessor', 'taskDataSetProcessor'];
      results.forEach((res, idx) => {
        if (res.status === 'rejected') {
          console.error(`${names[idx]} failed:`, res.reason);
        }
      });

      if (config.app.interval > 0) {
        console.log(`Waiting for ${config.app.interval} ms before next processing...`);
        await sleep(config.app.interval);
      }
    } catch (err) {
      console.error('Unexpected error in main loop:', err);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});