import { createSQSQueue } from './createSQSQueue';

const main = async () => {
  await createSQSQueue();
};

main();
