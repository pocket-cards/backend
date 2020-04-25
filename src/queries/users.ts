import { DynamoDB } from 'aws-sdk';

/** ユーザ情報 */
export const getUserInfo = (userId: string) =>
  ({
    TableName: TABLE_USERS,
    Key: {
      id: userId,
    },
  } as DynamoDB.DocumentClient.GetItemInput);

/** ユーザ情報を更新する */
export const updateUserInfo = (id: string, studyQuery: string) =>
  ({
    TableName: TABLE_USERS,
    Key: {
      id,
    },
    UpdateExpression: 'set #studyQuery = :studyQuery',
    ExpressionAttributeNames: {
      '#studyQuery': 'studyQuery',
    },
    ExpressionAttributeValues: {
      ':studyQuery': studyQuery,
    },
  } as DynamoDB.DocumentClient.UpdateItemInput);
