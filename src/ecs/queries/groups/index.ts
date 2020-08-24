import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { TGroups, GroupsKey } from 'typings/tables';
import * as query from './query';
import * as update from './update';

/** データ取得 */
export const get = (key: GroupsKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_GROUPS,
  Key: key,
});

/** データ登録 */
export const put = (item: TGroups): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_GROUPS,
  Item: item,
});

/** データ削除 */
export const del = (key: GroupsKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environment.TABLE_GROUPS,
  Key: {
    id: key.id,
    userId: key.userId,
  },
});

export { query, update };
