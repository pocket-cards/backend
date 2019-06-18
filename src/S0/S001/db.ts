import { DynamoDB } from 'aws-sdk';
import { getNow } from '@utils/utils';

/**
 * 新規学習単語対象一覧を取得する
 * 対象：  Times = 0, NextTime <= now, NextTime DESC
 */
export const queryItem_groups = (table: string, groupId: string) =>
  ({
    TableName: table,
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
      ':nextTime': getNow(),
    },
    IndexName: 'lsiIdx1',
    ScanIndexForward: false,
  } as DynamoDB.DocumentClient.QueryInput);

/** 単語情報を取得する */
export const queryItem_words = (table: string, word: string) =>
  ({
    TableName: table,
    Key: {
      word: word,
    },
  } as DynamoDB.DocumentClient.GetItemInput);
