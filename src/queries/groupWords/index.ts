import * as query from './query';
import * as update from './update';
import { Environment } from '@src/consts';
import { DynamoDB } from 'aws-sdk';
import { TGroupWords } from '@typings/tables';

/** データ取得 */
export const get = (groupId: string, word: string) =>
  ({
    TableName: Environment.TABLE_GROUP_WORDS,
    Key: {
      id: groupId,
      word: word,
    },
  } as DynamoDB.DocumentClient.GetItemInput);

/** データ登録 */
export const put = (item: TGroupWords): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_GROUP_WORDS,
  Item: item,
  ConditionExpression: 'attribute_not_exists(word)',
});

export { query, update };
