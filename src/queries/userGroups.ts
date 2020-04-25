import { DynamoDB } from 'aws-sdk';

// 環境変数
const TABLE_USER_GROUPS = process.env.TABLE_USER_GROUPS as string;

/** 単語情報を取得する */
export const queryByUserId01 = (userId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: TABLE_USER_GROUPS,
  KeyConditionExpression: '#userId = :userId',
  ExpressionAttributeNames: {
    '#userId': 'userId',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
  },
});

/** ユーザグループ情報 */
export const queryByUserId02 = (userId: string) =>
  ({
    TableName: TABLE_USER_GROUPS,
    ProjectionExpression: 'groupId',
    KeyConditionExpression: '#userId = :userId',
    ExpressionAttributeNames: {
      '#userId': 'userId',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  } as DynamoDB.DocumentClient.QueryInput);

/**
 * グループIDより、ユーザIDを検索する
 */
export const queryByGroupId02 = (groupId: string) =>
  ({
    TableName: TABLE_USER_GROUPS,
    ProjectionExpression: 'userId',
    KeyConditionExpression: '#groupId = :groupId',
    ExpressionAttributeNames: {
      '#groupId': 'groupId',
    },
    ExpressionAttributeValues: {
      ':groupId': groupId,
    },
    IndexName: 'gsiIdx1',
  } as DynamoDB.DocumentClient.QueryInput);
