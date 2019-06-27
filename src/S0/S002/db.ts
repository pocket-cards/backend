import { DynamoDB } from 'aws-sdk';

export const updateItem_users = (table: string, id: string, lastLogin: string) =>
  ({
    TableName: table,
    Key: {
      id,
    },
    UpdateExpression: 'set #lastLogin = :lastLogin',
    ExpressionAttributeNames: {
      '#lastLogin': 'lastLogin',
    },
    ExpressionAttributeValues: {
      ':lastLogin': lastLogin,
    },
  } as DynamoDB.DocumentClient.UpdateItemInput);
