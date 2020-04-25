import { DynamoDB } from 'aws-sdk';
import { Environment } from '@src/consts';
import { TWordMaster } from '@typings/tables';

/** データ取得 */
export const get = (id: string) =>
  ({
    TableName: Environment.TABLE_WORDS,
    Key: {
      id,
    },
  } as DynamoDB.DocumentClient.GetItemInput);

/** データ登録 */
export const put = (item: TWordMaster) =>
  ({
    TableName: Environment.TABLE_WORDS,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);
