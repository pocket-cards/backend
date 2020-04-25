import { DynamoDB } from 'aws-sdk';
import { Environment } from '@src/consts';
import { TWords } from '@typings/tables';

/** データ取得 */
export const get = (word: string) =>
  ({
    TableName: Environment.TABLE_GROUP_WORDS,
    Key: {
      word,
    },
  } as DynamoDB.DocumentClient.GetItemInput);

/** データ登録 */
export const put = (word: TWords) =>
  ({
    TableName: Environment.TABLE_GROUP_WORDS,
    Item: word,
  } as DynamoDB.DocumentClient.PutItemInput);
