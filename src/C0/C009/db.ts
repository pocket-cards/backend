import { DynamoDB } from 'aws-sdk';
import moment = require('moment');

/**
 * 単語対象一覧を取得する
 * 対象： Times = 1, LastTime = today
 */
export const queryItem_groups = (table: string, groupId: string) =>
  ({
    TableName: table,
    ProjectionExpression: 'word',
    KeyConditionExpression: '#id = :id',
    FilterExpression: '#times = :times and begins_with(#lastTime, :lastTime)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#lastTime': 'lastTime',
      '#times': 'times',
    },
    ExpressionAttributeValues: {
      ':id': groupId,
      ':lastTime': moment().format('YYYYMMDD'),
      ':times': 1,
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
