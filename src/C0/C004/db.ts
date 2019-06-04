import { DynamoDB } from 'aws-sdk';
import { GroupsItem } from '@typings/tables';

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
      groupId: groupId,
      word: word,
    },
  } as DynamoDB.DocumentClient.GetItemInput);

/** 単語情報を更新する */
export const updateItem_groups = (table: string, item: GroupsItem) =>
  ({
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
  } as DynamoDB.DocumentClient.UpdateItemInput);
