import * as query from './query';
import * as update from './update';
import { Environment } from '@src/consts';
import { DynamoDB } from 'aws-sdk';
import { TWords } from '@typings/tables';

/** データ取得 */
export const get = (id: string, groupId: string) =>
  ({
    TableName: Environment.TABLE_WORDS,
    Key: {
      id: id,
      groupId: groupId,
    },
  } as DynamoDB.DocumentClient.GetItemInput);

/** データ登録 */
export const put = (item: TWords): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_WORDS,
  Item: item,
  ConditionExpression: 'attribute_not_exists(id)',
});

export { query, update };
