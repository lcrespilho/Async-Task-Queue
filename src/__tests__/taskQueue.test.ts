import { taskQueue } from '../index';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms, ms));

test('Simple and synchronous tasks', () => {
  let x = 'a';
  const TaskQueue = taskQueue(1);
  TaskQueue.push((done) => {
    x += 'b';
    done();
  });
  TaskQueue.push((done) => {
    x += 'c';
    done();
  });
  expect(x).toBe('abc');
});

test('Async tasks with return value', async () => {
  const TaskQueue = taskQueue(1);
  const p1 = TaskQueue.push(async (done) => {
    await delay(100);
    done(1);
  });
  const p2 = TaskQueue.push(async (done) => {
    await delay(130);
    done(2);
  });
  const results = await Promise.all([p1, p2]);
  expect(results).toStrictEqual<number[]>([1, 2]);
});

test('Async tasks concurrency=1', async () => {
  let x = 'a';
  const t0 = Date.now();
  const TaskQueue = taskQueue(1);
  const task1 = TaskQueue.push(async (done) => {
    await delay(100);
    x += 'b';
    done();
  });
  const task2 = TaskQueue.push(async (done) => {
    await delay(90);
    x += 'c';
    done();
  });
  await Promise.all([task1, task2]);
  const elapsed = Date.now() - t0; // ~1900ms
  expect(x).toBe('abc');
  expect(elapsed).toBeGreaterThan(180);
  expect(elapsed).toBeLessThan(200);
});

test('Async tasks concurrency=2', async () => {
  let x = 'a';
  const t0 = Date.now();
  const TaskQueue = taskQueue(2);
  const task1 = TaskQueue.push(async (done) => {
    await delay(100);
    x += 'b';
    done();
  });
  const task2 = TaskQueue.push(async (done) => {
    await delay(90);
    x += 'c';
    done();
  });
  await Promise.all([task1, task2]);
  const elapsed = Date.now() - t0; // ~1000ms
  expect(x).toBe('acb');
  expect(elapsed).toBeGreaterThan(90);
  expect(elapsed).toBeLessThan(110);
});
