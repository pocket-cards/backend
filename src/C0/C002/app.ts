import { DynamoDB, AWSError } from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import { ResponseBody, RequestBody } from './index';
import { GroupsItem } from '@typings/tables';
import { dynamoDB } from '@utils/clientUtils';

// 環境変数
const WORDS_TABLE = process.env.WORDS_TABLE as string;
const GROUPS_TABLE = process.env.GROUPS_TABLE as string;

export const app = async (event: APIGatewayEvent): Promise<ResponseBody[]> => {
  if (!event.pathParameters) {
    return [] as ResponseBody[];
  }

  const groupId = event.pathParameters['groupId'];

  // DynamoDB Client 初期化
  const client = dynamoDB();

  const queryResult = await client.query(queryItem_groups(groupId)).promise();

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return [] as ResponseBody[];
  }

  // 戻り値に変換する
  return queryResult.Items.map(
    item =>
      ({
        word: (item as GroupsItem).word,
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
