import { DynamoDB } from 'aws-sdk';
import { History } from '@typings/tables';

/**
 * グループIDより、ユーザIDを検索する
 */
export const queryItem_userGroups = (table: string, groupId: string) =>
  ({
    TableName: table,
    ProjectionExpression: 'userId',
    KeyConditionExpression: '#groupId = :groupId',
    ExpressionAttributeNames: {
      '#groupId': 'groupId'
    },
    ExpressionAttributeValues: {
      ':groupId': groupId
    },
    IndexName: 'gsiIdx1'
  } as DynamoDB.DocumentClient.QueryInput);

/** 履歴情報を登録する */
export const putItem_history = (table: string, item: History) =>
  ({
    TableName: table,
    Item: item
  } as DynamoDB.DocumentClient.PutItemInput);
