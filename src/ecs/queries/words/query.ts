import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/**
 * 日付ごとの単語量を計算する
 */
export const queryByDate = (groupId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_WORDS,
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
  TableName: Environment.TABLE_WORDS,
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
export const lastStudyDate = (groupId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_WORDS,
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

/** 単語一覧 */
export const listByGroup = (groupId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_WORDS,
  KeyConditionExpression: '#groupId = :groupId',
  ExpressionAttributeNames: {
    '#groupId': 'groupId',
  },
  ExpressionAttributeValues: {
    ':groupId': groupId,
  },
  ScanIndexForward: false,
  IndexName: 'gsi1',
});

/**
 * 復習単語対象一覧を取得する
 *
 * 対象： Times = 1, NextTime = now
 */
export const review = (groupId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_WORDS,
  ProjectionExpression: 'id, nextTime, times',
  // KeyConditionExpression: '#id = :id and begins_with(#nextTime, :nextTime)',
  KeyConditionExpression: '#groupId = :groupId',
  FilterExpression: '#times = :times',
  ExpressionAttributeNames: {
    '#groupId': 'groupId',
    '#times': 'times',
  },
  ExpressionAttributeValues: {
    ':groupId': groupId,
    ':times': 1,
  },
  IndexName: 'gsi1',
  ScanIndexForward: false,
});

/**
 * テスト単語対象一覧を取得する
 * 対象： Times <> 0, NextTime <= now
 */
export const test = (groupId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_WORDS,
  ProjectionExpression: 'id, nextTime, times',
  KeyConditionExpression: '#groupId = :groupId and #nextTime <= :nextTime',
  FilterExpression: '#times <> :times',
  ExpressionAttributeNames: {
    '#groupId': 'groupId',
    '#nextTime': 'nextTime',
    '#times': 'times',
  },
  ExpressionAttributeValues: {
    ':groupId': groupId,
    ':nextTime': nextTime,
    ':times': 0,
  },
  IndexName: 'gsi1',
  ScanIndexForward: false,
});

/**
 * 新規学習単語対象一覧を取得する
 *
 * 対象：Times = 0, NextTime <= now, NextTime DESC
 */
export const news = (groupId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_WORDS,
  ProjectionExpression: 'id, nextTime, lastTime, times',
  KeyConditionExpression: '#groupId = :groupId and #nextTime <= :nextTime',
  FilterExpression: '#times = :times',
  ExpressionAttributeNames: {
    '#groupId': 'groupId',
    '#times': 'times',
    '#nextTime': 'nextTime',
  },
  ExpressionAttributeValues: {
    ':groupId': groupId,
    ':times': 0,
    ':nextTime': nextTime,
  },
  IndexName: 'gsi1',
  ScanIndexForward: false,
});
