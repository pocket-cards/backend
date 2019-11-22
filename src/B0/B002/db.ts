import { DynamoDB } from 'aws-sdk';

// 環境変数
const TABLE_USER_GROUPS = process.env.TABLE_USER_GROUPS as string;

/** 単語情報を取得する */
export const queryInput = (userId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: TABLE_USER_GROUPS,
  KeyConditionExpression: '#userId = :userId',
  ExpressionAttributeNames: {
    '#userId': 'userId',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
  },
});
