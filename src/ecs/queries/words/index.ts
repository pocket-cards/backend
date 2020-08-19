import * as query from './query';
import * as update from './update';
import { Environment } from '@consts';
import { DynamoDB } from 'aws-sdk';
import { TWords, WordKey } from 'typings/tables';

/** データ取得 */
export const get = (key: WordKey) =>
  ({
    TableName: Environment.TABLE_WORDS,
    Key: key,
  } as DynamoDB.DocumentClient.GetItemInput);

/** データ登録 */
export const put = (item: TWords): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_WORDS,
  Item: item,
});

export const putNotExist = (item: TWords): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_WORDS,
  Item: item,
  ConditionExpression: 'attribute_not_exists(id)',
});

/** データ削除 */
export const del = (key: WordKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environment.TABLE_WORDS,
  Key: key,
});

export { query, update };
