// Async task queue
function taskQueue(concurrency = 1) {
  let running = 0;
  const taskQueue: ({ task: any; resolve: any; })[] = [];
  const runTask = ({ task, resolve }) => {
    running++;
    task(() => {
      running--;
      resolve();
      if (taskQueue.length > 0) {
        runTask(taskQueue.shift()!);
      } else {
        if (running === 0) {
          console.log('Task queue is empty');
        }
      }
    });
  };
  const enqueueTask = (task, resolve) => {
    taskQueue.push({ task, resolve });
  };
  return {
    push: task => {
      let resolve;
      const promise = new Promise(r => (resolve = r));
      running < concurrency
        ? runTask({ task, resolve })
        : enqueueTask(task, resolve);
      return promise;
    },
    tasks: () => running + taskQueue.length,
  };
}
const TaskQueue = taskQueue(parseInt(process.env.CONCURRENCY || '1'));
