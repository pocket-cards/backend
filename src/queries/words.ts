import { DynamoDB } from 'aws-sdk';
import { TWords } from '@typings/tables';

/** Words Tableデータ検索 */
export const getItem = (word: string) =>
  ({
    TableName: TABLE_GROUP_WORDS,
    Key: {
      word: word,
    },
    // ProjectionExpression: 'KEYS_ONLY',
  } as DynamoDB.DocumentClient.GetItemInput);

/** Words Tableデータ登録 */
export const putItem = (word: TWords) =>
  ({
    TableName: TABLE_GROUP_WORDS,
    Item: word,
  } as DynamoDB.DocumentClient.PutItemInput);
