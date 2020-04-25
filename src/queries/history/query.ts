import { DynamoDB } from 'aws-sdk';
import { Environment } from '@src/consts';

/**
 * グループIDより、ユーザIDを検索する
 */
export const byUserId = (userId: string, timestamp: string) =>
  ({
    TableName: Environment.TABLE_HISTORY,
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
