import { DynamoDB } from 'aws-sdk';
import { Environment } from '@src/consts';

/** データ取得 */
export const get = (userId: string) =>
  ({
    TableName: Environment.TABLE_USERS,
    Key: {
      id: userId,
    },
  } as DynamoDB.DocumentClient.GetItemInput);
