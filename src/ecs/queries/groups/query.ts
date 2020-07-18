import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/** グループ一覧を取得する */
export const byUserId = (userId: string, projection?: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_GROUPS,
  // ProjectionExpression: projection,
  KeyConditionExpression: '#userId = :userId',
  ExpressionAttributeNames: {
    '#userId': 'userId',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
  },
  IndexName: 'gsi1',
});

/**
 * グループIDより、ユーザIDを検索する
 */
// export const byGroupId = (groupId: string) =>
//   ({
//     TableName: Environment.TABLE_GROUPS,
//     ProjectionExpression: 'userId',
//     KeyConditionExpression: '#groupId = :groupId',
//     ExpressionAttributeNames: {
//       '#groupId': 'groupId',
//     },
//     ExpressionAttributeValues: {
//       ':groupId': groupId,
//     },
//     IndexName: 'gsi1',
//   } as DynamoDB.DocumentClient.QueryInput);
