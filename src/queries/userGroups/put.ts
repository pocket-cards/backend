import { DynamoDB } from 'aws-sdk';
import { TUserGroups } from '@typings/tables';
import { Environment } from '@src/consts';

/** グループ登録 */
export const putItem = (item: TUserGroups): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_USER_GROUPS,
  Item: item,
});
