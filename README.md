# Localstack demo
## Overview
The purpose of this demo is to showcase how we can start interacting with services provided by AWS (Specifically [SQS](https://aws.amazon.com/sqs/)). We will explore this locally using a technology called [Localstack](https://www.localstack.cloud/) which emulates AWS services, and the [AWS-SDK](https://www.npmjs.com/package/@aws-sdk/client-sqs) library, which is used to interact with the SQS queue. (For reference, SQS is an Amazon-specific term; the more generic term is "Message Queue").

To better understand what we are building, it is recommended that you watch this [video](https://www.youtube.com/watch?v=xErwDaOc-Gs) explaining what a Message Queue is. If videos aren't your preference, here is an [article](https://www.ibm.com/topics/message-queues) with the same information.

This repository contains code that will allow you to do 4 things:
- Start a localstack instance via Docker.
- Deply an SQS queue to Localstack.
- Produce messages and send them to an SQS queue.
- Consume and process messages from an SQS queue.

## What is our end goal?
Before we get started, let's discuss the desired end goal of working through this code. The objective is to implement an SQS queue, which will allow us to decouple two specific services:
- Trade Generator – Responsible for generating trades.
- Trade Consumer – Responsible for processing trades.

Decoupling will be achieved using the SQS queue. The trade generator application will send trades to the queue, and the trade consumer application will process trades from the queue. In this setup, the queue will act as an intermediary between the two services.

This approach avoids having a tightly coupled system, like this:


<img width="804" alt="Screenshot 2024-10-08 at 11 35 17" src="https://github.com/user-attachments/assets/4a1a0a29-3cf1-438a-b82e-2fd7bfc507ef">

and instead we'll instead a decoupled system, like this:


<img width="804" alt="Screenshot 2024-10-08 at 11 35 37" src="https://github.com/user-attachments/assets/141251ff-dbb9-41b9-b15e-ba77bede92cd">

## Prerequisites
- [Docker / Setup](https://docs.docker.com/desktop/install/mac-install/) - This is used to run our localstack instance. 

## Installation
1. Clone the repository:
```
git clone git@github.com:Charlie-J-Martin/localstack-demo.git
```

2. Navigate to the project directory:
```
cd localstack-demo
```

3. Install dependencies:
```
npm install
```

### Getting started (Start from the root folder)

1. Navigate to the docker folder. 
```
cd packages/docker
```
Then, pull and run the LocalStack image using the following command:
```
docker-compose up -d
```

2. Once the Docker image has been pulled and is running in your Docker Desktop environment, you should see it listed on the containers page.

![Screenshot 2024-10-08 at 11 45 51](https://github.com/user-attachments/assets/1dfe58da-82ca-4658-920b-c6f7ebc3f970)

3. Next, head over to [localstack](https://app.localstack.cloud/sign-in) and sign in (using your GitHub account is the easiest way). Once signed in, you should see some tabs on the left-hand side. Go to `Localstack Instances` and ensure your instance says `running` at the top. This could take some time to appear. (If you want to force your browser to find your LocalStack instance, go to this [URL](https://localhost.localstack.cloud:4566)). 
Once your instance is running, you should see the `SQS` widget under the `Status` tab. This should say 'available' as it is the only service we've configured localstack to use.

![Screenshot 2024-10-08 at 11 50 11](https://github.com/user-attachments/assets/71d97946-650f-41e5-9809-b4422f67b233)

4. If you click on the `SQS` widget, you'll be taken to the queue management page. You should see a table that says `No Rows`. For now, we can confirm that LocalStack is running, and we will come back to this later.

![Screenshot 2024-10-08 at 11 53 35](https://github.com/user-attachments/assets/8ce6efa1-549a-4030-88e0-8e8c9835fbcb)

5. Back in the repository, head over to the `sqs-client` folder. In this folder, you'll find custom SQS functions to create, send, fetch, and delete messages from an SQS queue:

- `createSQSQueue.ts` - Responsible for creating an SQS queue.
- `sendMessageToSQS.ts` - Responsible for sending messages to an SQS queue.
- `fetchMessagesFromSQS.ts` - Responsible for fetching messages from an SQS queue.
- `deleteMessageFromSQS.ts` - Responsible for deleting messages from an SQS queue.

6. Let's create a new queue. In your terminal navigate to the `sqs-client` folder
```
cd ../sqs-client
```

Once in this folder, run the following command:
```
npm start
```
This will create a queue called `localstack-demo-queue` using the `createSQSQueue` function. After running this command, head back to your LocalStack [window](https://app.localstack.cloud/inst/default/resources/sqs) and click the refresh arrow. You should now be able to click into the new queue you've created and view some basic metadata.

![Screenshot 2024-10-08 at 11 55 19](https://github.com/user-attachments/assets/c107d2d5-4f79-4212-888e-89730f089708)

7. Now that we've got our queue, let's generate some messages. In the `trade-generator` folder, you'll see three files:
- `generateTrades.ts` - Responsible for generating trades. Each time this function is called, it generates a random trade from a predefined list.
- `main.ts` - Entry point for generating trades. It contains a for loop that calls `generateTrades` 100 times and sends the trades to the SQS queue.
- `trades.ts` - Contains an array of dummy trade data.

8. To create some trades for our queue, navigate to the 'trade-generator' folder in your terminal:
```
cd ../trade-generator
```
Once in this folder, run the following command:
```
npm start
```
This will generate 500 trades and send them to our queue using the `sendMessageToSQS` function. Go back to [LocalStack](https://app.localstack.cloud/inst/default/resources/sqs), navigate to your queue, and click on the messages tab. You should see the trades appear, though it may take a little time.

![Screenshot 2024-10-08 at 11 57 59](https://github.com/user-attachments/assets/bdaf4bd1-30e6-4169-b98b-b4bd9cb3cc5b)

9. Now that we have messages in our queue, let's process them. In the `trade-consumer` folder, you will find two files:
- `consumeMessages.ts` - Responsible for fetching trades from the queue. Each fetched trade is logged into the terminal, and once processed, the message is deleted from the queue. This file also contains a poll queue function which will fetch messages from the queue every second.
- `main.ts` -  Entry point for consuming trades. This function will poll the queue for messages.

10. To consume the trades, navigate to the 'trade-consumer' folder
```
cd ../trade-consumer
```
Once in this folder, run the following command:
```
npm start
```
This will poll the queue every second and fetch messages in batches of 10 using the `fetchMessagesFromSQS` function. Each message will be logged, then deleted from the queue using the `deleteMessageFromSQS` function.

You should be able to observe this process in the terminal, and you can verify the messages being deleted from the queue in [LocalStack](https://app.localstack.cloud/inst/default/resources/sqs) by hitting the refresh button and checking the number of messages in the bottom right-hand corner.

Terminal

![Screenshot 2024-10-08 at 12 06 37](https://github.com/user-attachments/assets/06d2ae80-21b5-4c5e-8f6f-e7144392b119)

Localstack

![Screenshot 2024-10-08 at 12 07 02](https://github.com/user-attachments/assets/d8ab0484-fb99-4e4d-a705-29718405039a)
