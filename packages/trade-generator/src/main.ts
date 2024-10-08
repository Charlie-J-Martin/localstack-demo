import { sendMessageToSQS } from '../../sqs-client/src/sendMessageToSQS';
import { generateTrades } from './generateTrades';

const queueUrl =
  'https://localhost.localstack.cloud:4566/000000000000/localstack-demo-queue';

const main = () => {
  for (let i = 0; i < 100; i++) {
    const message = generateTrades();
    sendMessageToSQS(queueUrl, message);
  }
};

main();