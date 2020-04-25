import { DynamoDB } from 'aws-sdk';
import { TGroupWords } from '@typings/tables';
import { Environment } from '@src/consts';

/** Group Tableデータ登録 */
export const item = (item: TGroupWords): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_GROUP_WORDS,
  Item: item,
  ConditionExpression: 'attribute_not_exists(word)',
});
