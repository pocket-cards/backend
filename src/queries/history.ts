import { DynamoDB } from 'aws-sdk';
import { THistory } from '@typings/tables';
import { Environment } from '@src/consts';

/**
 * グループIDより、ユーザIDを検索する
 */
export const queryByUserId = (userId: string, timestamp: string) =>
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

/** 履歴情報を登録する */
export const putItem = (item: THistory): DynamoDB.DocumentClient.Put => ({
  TableName: Environment.TABLE_HISTORY,
  Item: item,
});
