import { DynamoDB } from 'aws-sdk';
import { Users } from '@typings/tables';

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

export const putItem_users = (tableName: string, item: Users) =>
  ({
    TableName: tableName,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);
