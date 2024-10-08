import { SQSClient } from '@aws-sdk/client-sqs';

export const sqs = new SQSClient({
  region: 'eu-west-1',
  endpoint: 'http://127.0.0.1:4566',
  credentials: {
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  },
});
