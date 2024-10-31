import { CreateQueueCommand } from '@aws-sdk/client-sqs';
import { sqs } from './sqsClient';

const params = {
  QueueName: 'localstack-demo-queue',
  Attributes: {
    // DelaySeconds: '60',
    // MessageRetentionPeriod: '86400',
  },
};

export const createSQSQueue = async () => {
  try {
    await sqs.send(new CreateQueueCommand(params));
  } catch (err) {
    console.log('Error', err);
    throw err;
  }
};
