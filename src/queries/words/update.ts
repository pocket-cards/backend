import { DynamoDB } from 'aws-sdk';
import { TWords } from '@typings/tables';
import { Environment } from '@consts';

/** 次の学習時間を調整する */
export const updateItem01 = (id: string, word: string, nextTime: string): DynamoDB.DocumentClient.UpdateItemInput => ({
  TableName: Environment.TABLE_WORDS,
  Key: {
    id,
    word,
  },
  UpdateExpression: 'set #nextTime = :nextTime',
  ExpressionAttributeNames: {
    '#nextTime': 'nextTime',
  },
  ExpressionAttributeValues: {
    ':nextTime': nextTime,
  },
});

/** 単語情報を更新する */
export const updateItem02 = (item: TWords): DynamoDB.DocumentClient.Update => ({
  TableName: Environment.TABLE_WORDS,
  Key: {
    id: item.groupId,
    word: item.id,
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
