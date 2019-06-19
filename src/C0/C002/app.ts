import { DynamoDB } from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import { ResponseBody } from './index';
import { GroupWordsItem } from '@typings/tables';
import * as DBUtils from '@utils/dbutils';

const GROUPS_TABLE = process.env.GROUPS_TABLE as string;

export const app = async (event: APIGatewayEvent): Promise<ResponseBody[]> => {
  if (!event.pathParameters) {
    return [] as ResponseBody[];
  }

  const groupId = event.pathParameters['groupId'];

  const queryResult = await DBUtils.queryAsync(queryItem_groups(groupId));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return [] as ResponseBody[];
  }

  // 戻り値に変換する
  return queryResult.Items.map(
    item =>
      ({
        word: (item as GroupWordsItem).word,
      } as ResponseBody)
  );
};

/** 一覧を取得する */
const queryItem_groups = (groupId: string) =>
  ({
    TableName: GROUPS_TABLE,
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': groupId,
    },
    Limit: 10,
    ScanIndexForward: false,
  } as DynamoDB.DocumentClient.QueryInput);
