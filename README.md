# Localstack demo
## Overview
The purpose of this demo is to demonstrate how we can start intereacting with services provided by AWS (Specifically [SQS](https://aws.amazon.com/sqs/)). We can explore this locally through a technology called [Localstack](https://www.localstack.cloud/) which allows us to emulate AWS services and the [AWS-SDK](https://www.npmjs.com/package/@aws-sdk/client-sqs) library which is used to interact with the SQS queue. (For reference an SQS queue is an Amazon specific term, the more generic term is a Message Queue).

In order to understand what we are building its recommended that you watch this [video](https://www.youtube.com/watch?v=xErwDaOc-Gs) on what a Message Queue is. If videos aren't your style here is an [article](https://www.ibm.com/topics/message-queues) to the same information.

This repository contains code that will allow you to do 4 things:
- Start a localstack instance via Docker.
- Deply an SQS queue to Localstack.
- Produce messages and send them to an SQS queue.
- Consume and process messages from an SQS queue.

Before we get started let's talk about the desired end goal of working through this code. The end goal is to implement an SQS queue which will allow us to decouple two specific services: 
- A trade generator - Responsible for generating trades.
- A trade consumer - Responsible for processing trades.

Decoupling will come with the use of the SQS queue, we will send trades to the queue from the trade generator and will process trades from the queue with the trade consumer. The queue here will be a middle man between the two services.

Rather than having a tightly coupled system like this.
<img width="804" alt="Screenshot 2024-10-08 at 11 35 17" src="https://github.com/user-attachments/assets/4a1a0a29-3cf1-438a-b82e-2fd7bfc507ef">

We'll instead create this decoupled system like this:
<img width="804" alt="Screenshot 2024-10-08 at 11 35 37" src="https://github.com/user-attachments/assets/141251ff-dbb9-41b9-b15e-ba77bede92cd">

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - This will be used to run our localstack instance.

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
Then pull and run the Localstack image using the following command:
```
docker-compose up -d
```

2. Once the docker image has been pulled and running in your Docker Desktop environment. (You should see this on the containers page) Head over to [localstack](https://app.localstack.cloud/sign-in) and signin. Github account is the easiest way to sign in. 

3. Once signed in you should see some tabs on the left hand side. Go to `Localstack Instances`. Once here make sure your instance says `running` at the top. This could take a while to appear. Once you instance is running you should now be able to see the `SQS` widget under the heading available.

4. If you click on the `SQS` widget you'll be taken to the queue management page. You should see a table that says `No Rows`. For now we can see that localstack is running, we will come back to this later.

5. Back in the repo, head over to the sqs-client folder. In this folder you will see some custom SQS functions to create, send, fetch and delete messages from an SQS queue. 

- `createSQSQueue.ts` - Responsible for creating an SQS queue.
- `sendMessageToSQS.ts` - Responsible for sending messages to an SQS queue.
- `fetchMessagesFromSQS.ts` - Responsible for fetching messages from an SQS queue.
- `deleteMessageFromSQS.ts` - Responsible for deleting messages from an SQS queue.

6. Let's create a new queue. In your terminal navigate over to the `sqs-client` folder
```
cd ../sqs-client
```

Once in this folder run the command:
```
npm start
```
This will create a queue called `localstack-demo-queue` (using the `createSQSQueue` function). Once you've ran that command head back to your localstack [window](https://app.localstack.cloud/inst/default/resources/sqs) and click the refresh arrow. You should be able to click into the new queue you've just made and see some basic meta data.

7. Now we've got our queue, let's generate some messages. If you head over to the `message-generator` folder you should see 3 files:
- `generateTrades.ts` - Responsible for generating trades. Each time this is called it generates a random trade from a list of trades.
- `main.ts` - Entry point for generating trades. For loop which calls generateTrades 100 times and sends the trades to the SQS queue.
- `trades.ts` - Holds an array of dummy trade data.

8. Let's create some trades for our queue. In your terminal navigate over to the 'message-generator' folder
```
cd ../message-generator
```
Once in this folder run the command:
```
npm start
```
This will generate 100 trades and then send them to our queue (using the `sendMessageToSQS` function). If you head back over to [window](https://app.localstack.cloud/inst/default/resources/sqs) and go to our queue then click on the messages tab we should see our messages. (This again may take some time to come through)

9. Now we've got our messages in our queue, lets process them. If you head over to the `message-consumer` folder you should see 2 files:
- `consumeMessages.ts` - Responsible for fetching trades off of the queue, for each message the trade is logged into the terminal. Once the message is processed we then delete the message from the queue (using the `deleteMessageFromSQS`).
- `main.ts` - Entry point for consuming trades.

10. Let's consume our trades. In your terminal navigate over to the 'message-consumer' folder
```
cd ../message-consumer
```
Once in this folder run the command:
```
npm start
```
This will poll the queue every second and will fetch messages from the queue (using the `fetchMessagesFromSQS` function), this is done in batches of 10. For each message in the queue the message gets logged then it is deleted from the queue (using the `deleteMessageFromSQS` function).

