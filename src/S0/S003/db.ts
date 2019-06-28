import { DynamoDB } from 'aws-sdk';

/** ユーザ情報 */
export const getItem_users = (tableName: string, userId: string) =>
  ({
    TableName: tableName,
    Key: {
      id: userId,
    },
  } as DynamoDB.DocumentClient.GetItemInput);

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

/** 最後の学習日を取得する */
export const queryItem_groupsOnly = (table: string, groupId: string) =>
  ({
    TableName: table,
    IndexName: 'lsiIdx2',
    ProjectionExpression: 'lastTime',
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': groupId,
    },
    Limit: 1,
    ScanIndexForward: false,
  } as DynamoDB.DocumentClient.QueryInput);

/** 学習履歴ある単語を全部取得する */
export const queryItem_groups = (table: string, groupId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: table,
  ProjectionExpression: 'nextTime, word',
  KeyConditionExpression: '#id = :id',
  FilterExpression: 'attribute_exists(lastTime)',
  ExpressionAttributeNames: {
    '#id': 'id',
  },
  ExpressionAttributeValues: {
    ':id': groupId,
  },
});

/** ユーザ情報を更新する */
export const updateItem_users = (table: string, id: string, studyQuery: string) =>
  ({
    TableName: table,
    Key: {
      id,
    },
    UpdateExpression: 'set #studyQuery = :studyQuery',
    ExpressionAttributeNames: {
      '#studyQuery': 'studyQuery',
    },
    ExpressionAttributeValues: {
      ':studyQuery': studyQuery,
    },
  } as DynamoDB.DocumentClient.UpdateItemInput);

/** 次の学習時間を調整する */
export const updateItem_groupWords = (table: string, id: string, word: string, nextTime: string) =>
  ({
    TableName: table,
    Key: {
      id,
      word,
    },
    UpdateExpression: 'set #nextTime = :nextTime',
    ExpressionAttributeNames: {
      '#nextTime': 'nextTime',
    },
    ExpressionAttributeValues: {
      ':nextTime': nextTime,
    },
  } as DynamoDB.DocumentClient.UpdateItemInput);
