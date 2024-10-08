import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sqs } from './sqsClient';

type Message = {
  messageId: string;
  timeStamp: string;
  message: string;
};

export const sendMessageToSQS = async (queueUrl: string, message: Message) => {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(message),
  };

  try {
    const sendRequest = await sqs.send(new SendMessageCommand(params));
    console.log('Message sent successfully', sendRequest.MessageId);
  } catch (err) {
    console.error('Error sending messages', err);
    throw err;
  }
};
