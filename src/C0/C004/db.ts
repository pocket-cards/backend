import { DynamoDB } from 'aws-sdk';
import { GroupWordsItem, HistoryItem } from '@typings/tables';

/**
 * 新規学習単語対象一覧を取得する
 * 対象： Times = 0
 */
export const queryItem_groups = (table: string, groupId: string) =>
  ({
    TableName: table,
    ProjectionExpression: 'nextTime, word',
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
export const getItem_groups = (table: string, groupId: string, word: string) =>
  ({
    TableName: table,
    Key: {
      id: groupId,
      word: word,
    },
  } as DynamoDB.DocumentClient.GetItemInput);

/** 単語情報を更新する */
export const updateItem_groups = (table: string, item: GroupWordsItem): DynamoDB.DocumentClient.Update => ({
  TableName: table,
  Key: {
    id: item.id,
    word: item.word,
  },
  UpdateExpression: 'set #times = :times, #lastTime = :lastTime, #nextTime = :nextTime',
  ExpressionAttributeNames: {
    '#times': 'times',
    '#lastTime': 'lastTime',
    '#nextTime': 'nextTime',
  },
  ExpressionAttributeValues: {
    ':times': item.times,
    ':lastTime': item.lastTime,
    ':nextTime': item.nextTime,
  },
});

/** 履歴情報を登録する */
export const putItem_history = (table: string, item: HistoryItem): DynamoDB.DocumentClient.Put => ({
  TableName: table,
  Item: item,
});

/**
 * グループIDより、ユーザIDを検索する
 */
export const queryItem_userGroups = (table: string, groupId: string) =>
  ({
    TableName: table,
    ProjectionExpression: 'userId',
    KeyConditionExpression: '#groupId = :groupId',
    ExpressionAttributeNames: {
      '#groupId': 'groupId',
    },
    ExpressionAttributeValues: {
      ':groupId': groupId,
    },
    IndexName: 'gsiIdx1',
  } as DynamoDB.DocumentClient.QueryInput);
