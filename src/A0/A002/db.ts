import { DynamoDB } from 'aws-sdk';

/**
 * グループIDより、ユーザIDを検索する
 */
export const queryItem_history = (table: string, userId: string, timestamp: string) =>
  ({
    TableName: table,
    ProjectionExpression: 'userId, #timestamp, times, lastTime',
    KeyConditionExpression: '#userId = :userId and #timestamp >= :timestamp',
    ExpressionAttributeNames: {
      '#userId': 'userId',
      '#timestamp': 'timestamp',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':timestamp': timestamp,
    },
  } as DynamoDB.DocumentClient.QueryInput);
