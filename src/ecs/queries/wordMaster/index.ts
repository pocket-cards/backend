import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { TWordMaster } from 'typings/tables';

/** データ取得 */
export const get = (id: string) =>
  ({
    TableName: Environment.TABLE_WORD_MASTER,
    Key: {
      id,
    },
  } as DynamoDB.DocumentClient.GetItemInput);

/** データ登録 */
export const put = (item: TWordMaster) =>
  ({
    TableName: Environment.TABLE_WORD_MASTER,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);
