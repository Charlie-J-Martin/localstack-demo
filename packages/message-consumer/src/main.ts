import { consumeMessage, pollQueue } from './consumeMessage';

const queueUrl =
  'https://localhost.localstack.cloud:4566/000000000000/localstack-demo-queue';

const main = async () => {
  pollQueue(queueUrl);
};

main();
