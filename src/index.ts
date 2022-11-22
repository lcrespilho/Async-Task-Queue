// Async task queue
export const taskQueue = (concurrency: string | number = 1, logOnEmpty = false) => {
  let running = 0;
  const taskQueue: { task: (done: (result?: any) => void) => void; resolve: any }[] = [];
  const runTask = ({ task, resolve }: { task: (done: (result?: any) => void) => void; resolve: any }) => {
    running++;
    task((result) => {
      running--;
      resolve(result);
      if (taskQueue.length > 0) {
        runTask(taskQueue.shift()!);
      } else {
        if (running === 0 && logOnEmpty) {
          console.log('Task queue is empty');
        }
      }
    });
  };
  const enqueueTask = (task: (done: (result?: any) => void) => void, resolve: any) => {
    taskQueue.push({ task, resolve });
  };
  return {
    push: (task: (done: (result?: any) => void) => void) => {
      let resolve: any;
      const promise = new Promise((r) => (resolve = r));
      running < concurrency ? runTask({ task, resolve }) : enqueueTask(task, resolve);
      return promise;
    },
    tasks: () => running + taskQueue.length,
  };
};
