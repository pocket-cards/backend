import { DynamoDB } from 'aws-sdk';

/**
 * 復習単語対象一覧を取得する
 * 対象： Times = 1, NextTime = now
 */
export const queryItem_groups = (table: string, groupId: string) =>
  ({
    TableName: table,
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
  } as DynamoDB.DocumentClient.QueryInput);

/** 単語情報を取得する */
export const queryItem_words = (table: string, word: string) =>
  ({
    TableName: table,
    Key: {
      word: word,
    },
  } as DynamoDB.DocumentClient.GetItemInput);
