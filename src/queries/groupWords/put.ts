import { DynamoDB } from 'aws-sdk';
import { TGroupWords } from '@typings/tables';

/** Group Tableデータ登録 */
export const item = (item: TGroupWords): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: TABLE_GROUP_WORDS,
  Item: item,
  ConditionExpression: 'attribute_not_exists(word)',
});
