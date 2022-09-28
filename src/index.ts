// Async task queue
export const taskQueue = (concurrency = 1) => {
  let running = 0;
  const taskQueue: { task: (done: () => void) => void; resolve: any }[] = [];
  const runTask = ({
    task,
    resolve,
  }: {
    task: (done: () => void) => void;
    resolve: any;
  }) => {
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
  const enqueueTask = (task: (done: () => void) => void, resolve: any) => {
    taskQueue.push({ task, resolve });
  };
  return {
    push: (task: (done: () => void) => void) => {
      let resolve: any;
      const promise = new Promise(r => (resolve = r));
      running < concurrency
        ? runTask({ task, resolve })
        : enqueueTask(task, resolve);
      return promise;
    },
    tasks: () => running + taskQueue.length,
  };
};

// const TaskQueue = taskQueue(parseInt(process.env.CONCURRENCY || '1'));

// TaskQueue.push((done) => {
//   // work...
//   done();
// });
