# Async-Task-Queue
Simple Async Task Queue

> Task queue with concurrency control.

Useful for rate-limiting async (or sync) operations.

## Install

```sh
npm install @lcrespilho/async-task-queue
```

## Usage
```js
import { taskQueue } from '@lcrespilho/async-task-queue';

const TaskQueue = taskQueue(process.env.CONCURRENCY || 2);

(async () => {
  const t1 = TaskQueue.push(done => {
    // do sync work...
    done(/*promise return value*/); // notifies that the task is completed
  });

  const t2 = TaskQueue.push(async done => {
    // do sync/async work...
    done(/*promise return value*/); // notifies that the task is completed
  });

  const t3 = TaskQueue.push(async done => {
    // do sync/async work...
    done(/*promise return value*/); // notifies that the task is completed
  });

  await Promise.all([t1, t2, t3]);

  // all tasks completed
})();
```

## API/types

```ts
export declare const taskQueue: (concurrency?: string | number, logOnEmpty?: boolean) => {
    push: (task: (done: (result?: any) => void) => void) => Promise<unknown>;
    tasks: () => number;
};
```
