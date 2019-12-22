import { DynamoDB } from 'aws-sdk';
import { getNow } from '@utils/dateUtils';

/**
 * テスト単語対象一覧を取得する
 * 対象： Times <> 0, NextTime <= now
 */
export const queryItem_groups = (table: string, groupId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: table,
  ProjectionExpression: 'nextTime, word, times',
  KeyConditionExpression: '#id = :id and #nextTime <= :nextTime',
  FilterExpression: '#times <> :times',
  ExpressionAttributeNames: {
    '#id': 'id',
    '#nextTime': 'nextTime',
    '#times': 'times'
  },
  ExpressionAttributeValues: {
    ':id': groupId,
    ':nextTime': getNow(),
    ':times': 0
  },
  IndexName: 'lsiIdx1',
  ScanIndexForward: false
});

/** 単語情報を取得する */
export const queryItem_words = (table: string, word: string): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: table,
  Key: {
    word: word
  }
});
