import { DynamoDB } from 'aws-sdk';
import { Environment } from '@src/consts';

/** 単語情報を取得する */
export const item = (groupId: string, word: string) =>
  ({
    TableName: Environment.TABLE_GROUP_WORDS,
    Key: {
      id: groupId,
      word: word,
    },
  } as DynamoDB.DocumentClient.GetItemInput);
