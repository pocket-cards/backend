import { DynamoDB } from 'aws-sdk';

/**
 * 日付ごとの単語量を計算する
 */
export const queryByGroupId01 = (groupId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: TABLE_GROUP_WORDS,
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
});

export const queryByGroupId02 = (groupId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: TABLE_GROUP_WORDS,
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
});

/** 最後の学習日を取得する */
export const queryByGroupId03 = (groupId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: TABLE_GROUP_WORDS,
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
});

/** 一覧を取得する */
export const queryByGroupId04 = (groupId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: TABLE_GROUP_WORDS,
  KeyConditionExpression: '#id = :id',
  ExpressionAttributeNames: {
    '#id': 'id',
  },
  ExpressionAttributeValues: {
    ':id': groupId,
  },
  Limit: 10,
  ScanIndexForward: false,
});

/**
 * 復習単語対象一覧を取得する
 * 対象： Times = 1, NextTime = now
 */
export const queryByGroupId05 = (groupId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: TABLE_GROUP_WORDS,
  ProjectionExpression: 'nextTime, word, times',
  // KeyConditionExpression: '#id = :id and begins_with(#nextTime, :nextTime)',
  KeyConditionExpression: '#id = :id',
  FilterExpression: '#times = :times',
  ExpressionAttributeNames: {
    '#id': 'id',
    // '#nextTime': 'nextTime',
    '#times': 'times',
  },
  ExpressionAttributeValues: {
    ':id': groupId,
    // ':nextTime': getNow(),
    ':times': 1,
  },
  IndexName: 'lsiIdx1',
  ScanIndexForward: false,
});

/**
 * テスト単語対象一覧を取得する
 * 対象： Times <> 0, NextTime <= now
 */
export const queryByGroupId06 = (groupId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: TABLE_GROUP_WORDS,
  ProjectionExpression: 'nextTime, word, times',
  KeyConditionExpression: '#id = :id and #nextTime <= :nextTime',
  FilterExpression: '#times <> :times',
  ExpressionAttributeNames: {
    '#id': 'id',
    '#nextTime': 'nextTime',
    '#times': 'times',
  },
  ExpressionAttributeValues: {
    ':id': groupId,
    ':nextTime': nextTime,
    ':times': 0,
  },
  IndexName: 'lsiIdx1',
  ScanIndexForward: false,
});

/**
 * 復習単語対象一覧を取得する
 * 対象： Times = 1, NextTime = now
 */
export const queryByGroupId07 = (groupId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: TABLE_GROUP_WORDS,
  ProjectionExpression: 'nextTime, word, times',
  // KeyConditionExpression: '#id = :id and begins_with(#nextTime, :nextTime)',
  KeyConditionExpression: '#id = :id',
  FilterExpression: '#times = :times',
  ExpressionAttributeNames: {
    '#id': 'id',
    // '#nextTime': 'nextTime',
    '#times': 'times',
  },
  ExpressionAttributeValues: {
    ':id': groupId,
    // ':nextTime': getNow(),
    ':times': 1,
  },
  IndexName: 'lsiIdx1',
  ScanIndexForward: false,
});

/**
 * 新規学習単語対象一覧を取得する
 * 対象：  Times = 0, NextTime <= now, NextTime DESC
 */
export const queryByGroupId08 = (groupId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: TABLE_GROUP_WORDS,
  ProjectionExpression: 'nextTime, lastTime, word, times',
  KeyConditionExpression: '#id = :id and #nextTime <= :nextTime',
  FilterExpression: '#times = :times',
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
  ScanIndexForward: false,
});
