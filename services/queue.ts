import { SQS, AWSError } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import vars from "@vars";

const BATCH_COUNT = 10;

const sqs = new SQS({ region: vars.region });

export const sendMessageToSQS = async (
  queueUrl: string,
  message: object
): Promise<PromiseResult<SQS.SendMessageResult, AWSError>> => {
  const messageObject = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(message),
  };
  console.log("Send message to sqs", messageObject.MessageBody);
  // Send the order data to the SQS queue
  return await sqs.sendMessage(messageObject).promise();
};

export const sendMessagesToSQS = async (
  queueUrl: string,
  messages: Array<object>
): Promise<void> => {
  for (let i = 0; i < messages.length; i += BATCH_COUNT) {
    const slicedMessages = messages.slice(i, i + BATCH_COUNT);
    const messageGroup = slicedMessages.map((message, i) => {
      return {
        Id: `pos_${i}`,
        MessageBody: JSON.stringify(message),
      };
    });

    console.log("Send messages to sqs", messageGroup);

    const params = {
      Entries: messageGroup,
      QueueUrl: queueUrl,
    };
    // Send the order data to the SQS queue
    await sqs.sendMessageBatch(params).promise();
  }
};
