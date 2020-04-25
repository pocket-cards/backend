import { DynamoDB } from 'aws-sdk';
import { TGroupWords } from '@typings/tables';

/** 次の学習時間を調整する */
export const updateItem01 = (id: string, word: string, nextTime: string): DynamoDB.DocumentClient.UpdateItemInput => ({
  TableName: TABLE_GROUP_WORDS,
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
export const updateItem02 = (item: TGroupWords): DynamoDB.DocumentClient.Update => ({
  TableName: TABLE_GROUP_WORDS,
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
