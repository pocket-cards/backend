import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/**
 * グループIDより、ユーザIDを検索する
 */
export const byUserId = (user: string, timestamp: string) =>
  ({
    TableName: Environment.TABLE_HISTORIES,
    ProjectionExpression: 'user, #timestamp, times, lastTime',
    KeyConditionExpression: '#user = :user and #timestamp >= :timestamp',
    ExpressionAttributeNames: {
      '#user': 'user',
      '#timestamp': 'timestamp',
    },
    ExpressionAttributeValues: {
      ':user': user,
      ':timestamp': timestamp,
    },
  } as DynamoDB.DocumentClient.QueryInput);
