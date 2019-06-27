import { DynamoDB } from 'aws-sdk';

export const updateItem_users = (table: string, id: string, login: string) =>
  ({
    TableName: table,
    Key: {
      id,
    },
    UpdateExpression: 'set #lastLogin = #login, #login = :login',
    ExpressionAttributeNames: {
      '#lastLogin': 'lastLogin',
      '#login': 'login',
    },
    ExpressionAttributeValues: {
      ':login': login,
    },
  } as DynamoDB.DocumentClient.UpdateItemInput);
