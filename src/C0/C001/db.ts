import { DynamoDB } from 'aws-sdk';
import { WordsItem } from '@typings/tables';

/** Words Tableデータ検索 */
export const gutItem_words = (tableName: string, word: string) =>
  ({
    TableName: tableName,
    Key: {
      word: word,
    },
  } as DynamoDB.DocumentClient.GetItemInput);

/** Words Tableデータ登録 */
export const putItem_words = (tableName: string, word: WordsItem) =>
  ({
    TableName: tableName,
    Item: word,
  } as DynamoDB.DocumentClient.PutItemInput);

/** Group Tableデータ登録 */
export const putItem_groups = (tableName: string, groupId: string, word: string) =>
  ({
    TableName: tableName,
    Item: {
      id: groupId,
      // nextTime: moment().format('YYYYMMDDHHmmssSSS'),
      nextTime: '00000000000000000',
      word,
    },
    ConditionExpression: 'attribute_not_exists(word)',
  } as DynamoDB.DocumentClient.PutItemInput);
