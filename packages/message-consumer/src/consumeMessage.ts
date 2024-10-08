import { deleteMessageFromSQS } from '../../sqs-client/src/deleteMessageFromSQS';
import { fetchMessagesFromSQS } from '../../sqs-client/src/fetchMessagesFromSQS';

export const consumeMessage = async (queueUrl: string) => {
  const messages = await fetchMessagesFromSQS(queueUrl);
  if (messages) {
    for (const message of messages) {
      console.log(
        'Processing order... \n',
        'Order:',
        JSON.parse(message.Body!),
      );
      await deleteMessageFromSQS(queueUrl, message.ReceiptHandle!);
    }
  } else {
    console.log('No messages received');
  }
};

export const pollQueue = async (queueUrl: string) => {
  while (true) {
    await consumeMessage(queueUrl);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
