// import { DynamoDB } from 'aws-sdk';
// import { Words, GroupWords } from '@typings/tables';

// /** Words Tableデータ検索 */
// export const getItem_words = (tableName: string, word: string) =>
//   ({
//     TableName: tableName,
//     Key: {
//       word: word
//     }
//     // ProjectionExpression: 'KEYS_ONLY',
//   } as DynamoDB.DocumentClient.GetItemInput);

// /** Words Tableデータ登録 */
// export const putItem_words = (tableName: string, word: Words) =>
//   ({
//     TableName: tableName,
//     Item: word
//   } as DynamoDB.DocumentClient.PutItemInput);

// /** Group Tableデータ登録 */
// export const putItem_groups = (tableName: string, item: GroupWords) =>
//   ({
//     TableName: tableName,
//     Item: item,
//     ConditionExpression: 'attribute_not_exists(word)'
//   } as DynamoDB.DocumentClient.PutItemInput);
