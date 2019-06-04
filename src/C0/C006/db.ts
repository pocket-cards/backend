import { DynamoDB } from 'aws-sdk';

/**
 * 新規学習単語対象一覧を取得する
 * 対象： Times = 0
 */
export const queryItem_groups = (table: string, groupId: string) =>
  ({
    TableName: table,
    ProjectionExpression: 'nextTime, word, times',
    KeyConditionExpression: '#id = :id',
    FilterExpression: '#times = :times',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#times': 'times',
    },
    ExpressionAttributeValues: {
      ':id': groupId,
      ':times': 0,
    },
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
