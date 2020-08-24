import { Environment } from '@consts';
import { DynamoDB } from 'aws-sdk';
import { GroupsKey } from 'typings/tables';

export const addCount = (id: string, userId: string, count: number): DynamoDB.DocumentClient.UpdateItemInput => ({
  TableName: Environment.TABLE_GROUPS,
  Key: {
    id,
    userId,
  } as GroupsKey,
  UpdateExpression: 'set #count = #count + :nums',
  ExpressionAttributeNames: {
    '#count': 'count',
  },
  ExpressionAttributeValues: {
    ':nums': count,
  },
});

export const minusCount = (id: string, userId: string, count: number): DynamoDB.DocumentClient.Update => ({
  TableName: Environment.TABLE_GROUPS,
  Key: {
    id,
    userId,
  } as GroupsKey,
  UpdateExpression: 'set #count = #count - :nums',
  ExpressionAttributeNames: {
    '#count': 'count',
  },
  ExpressionAttributeValues: {
    ':nums': count,
  },
});
