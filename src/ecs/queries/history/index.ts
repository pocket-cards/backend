import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { THistories } from 'typings/tables';
import * as query from './query';

/** データ登録 */
export const put = (item: THistories) =>
  ({
    TableName: Environment.TABLE_HISTORIES,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);

export { query };
