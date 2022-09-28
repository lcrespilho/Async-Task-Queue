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

test('Async tasks concurrency=1', async () => {
  let x = 'a';
  const t0 = Date.now();
  const TaskQueue = taskQueue(1);
  const task1 = TaskQueue.push(async (done) => {
    await delay(1000);
    x += 'b';
    done();
  });
  const task2 = TaskQueue.push(async (done) => {
    await delay(900);
    x += 'c';
    done();
  });
  await Promise.all([task1, task2]);
  const elapsed = Date.now() - t0; // ~1900ms
  expect(x).toBe('abc');
  expect(elapsed).toBeGreaterThan(1800);
  expect(elapsed).toBeLessThan(2000);
});

test('Async tasks concurrency=2', async () => {
  let x = 'a';
  const t0 = Date.now();
  const TaskQueue = taskQueue(2);
  const task1 = TaskQueue.push(async (done) => {
    await delay(1000);
    x += 'b';
    done();
  });
  const task2 = TaskQueue.push(async (done) => {
    await delay(900);
    x += 'c';
    done();
  });
  await Promise.all([task1, task2]);
  const elapsed = Date.now() - t0; // ~1000ms
  expect(x).toBe('acb');
  expect(elapsed).toBeGreaterThan(900);
  expect(elapsed).toBeLessThan(1100);
});
