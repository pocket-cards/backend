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

/**
 * 日付ごとの単語量を計算する
 */
export const queryItem_groups_test = (table: string, groupId: string, nextTime: string) =>
  ({
    TableName: table,
    ProjectionExpression: 'word',
    KeyConditionExpression: '#id = :id and #nextTime = :nextTime',
    FilterExpression: '#times <> :times',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#times': 'times',
      '#nextTime': 'nextTime',
    },
    ExpressionAttributeValues: {
      ':id': groupId,
      ':times': 0,
      ':nextTime': nextTime,
    },
    IndexName: 'lsiIdx1',
  } as DynamoDB.DocumentClient.QueryInput);

export const queryItem_groups_review = (table: string, groupId: string, nextTime: string) =>
  ({
    TableName: table,
    ProjectionExpression: 'word',
    KeyConditionExpression: '#id = :id and #nextTime = :nextTime',
    FilterExpression: '#times > :times',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#times': 'times',
      '#nextTime': 'nextTime',
    },
    ExpressionAttributeValues: {
      ':id': groupId,
      ':times': 1,
      ':nextTime': nextTime,
    },
    IndexName: 'lsiIdx1',
  } as DynamoDB.DocumentClient.QueryInput);

/** ユーザグループ情報 */
export const queryItem_userGroups = (tableName: string, userId: string) =>
  ({
    TableName: tableName,
    ProjectionExpression: 'groupId',
    KeyConditionExpression: '#userId = :userId',
    ExpressionAttributeNames: {
      '#userId': 'userId',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  } as DynamoDB.DocumentClient.QueryInput);
