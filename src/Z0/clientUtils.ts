import { DynamoDB } from 'aws-sdk';

/** Dynamodb Client初期化 */
export const dynamoDB = (
  client: DynamoDB.DocumentClient
): DynamoDB.DocumentClient => {
  if (client) return client;

  return new DynamoDB.DocumentClient({
    region: process.env.DEFAULT_REGION
  });
};
