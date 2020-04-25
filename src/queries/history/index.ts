import { DynamoDB } from 'aws-sdk';
import { Environment } from '@src/consts';
import { THistory } from '@typings/tables';

/** データ登録 */
export const put = (item: THistory) =>
  ({
    TableName: Environment.TABLE_WORDS,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);
