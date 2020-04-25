import { DynamoDB } from 'aws-sdk';
import { Environment } from '@src/consts';

/** グループ取得 */
export const item = (userId: string, groupId: string): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_USER_GROUPS,
  Key: {
    userId,
    groupId,
  },
});
