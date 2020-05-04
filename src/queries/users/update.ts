import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/** ユーザ情報を更新する */
export const userInfo = (id: string, studyQuery: string) =>
  ({
    TableName: Environment.TABLE_USERS,
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
