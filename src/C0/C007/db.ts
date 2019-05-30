import { DynamoDB } from 'aws-sdk';
import moment = require('moment');

/**
 * 新規学習単語対象一覧を取得する
 * 対象： Times = 0
 */
export const queryItem_groups = (table: string, groupId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: table,
  ProjectionExpression: 'nextTime, word',
  KeyConditionExpression: '#id = :id',
  FilterExpression: '#times <> :times and #nextTime <= :nextTime',
  ExpressionAttributeNames: {
    '#id': 'id',
    '#nextTime': 'nextTime',
    '#times': 'times',
  },
  ExpressionAttributeValues: {
    ':id': groupId,
    ':nextTime': moment().format('YYYYMMDDHHmmss'),
    ':times': 0,
  },
  ScanIndexForward: false,
});

/** 単語情報を取得する */
export const queryItem_words = (table: string, word: string): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: table,
  Key: {
    word: word,
  },
});
