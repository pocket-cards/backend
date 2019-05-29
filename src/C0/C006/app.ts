import { DynamoDB } from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import { ResponseBody } from './index';
import { dynamoDB } from '@utils/clientUtils';
import { GroupsItem } from '@typings/tables';

let client: DynamoDB.DocumentClient;

// 環境変数
const WORDS_TABLE = process.env.WORDS_TABLE as string;
const GROUPS_TABLE = process.env.GROUPS_TABLE as string;
// 最大単語数、default 10件
const WORDS_LIMIT = process.env.WORDS_LIMIT
  ? Number(process.env.WORDS_LIMIT)
  : 10;

export const app = async (event: APIGatewayEvent): Promise<ResponseBody[]> => {
  if (!event.pathParameters) {
    return [] as ResponseBody[];
  }

  const groupId = event.pathParameters['groupId'];

  // DynamoDB Client 初期化
  client = dynamoDB(client);

  const queryResult = await client.query(queryItem_groups(groupId)).promise();

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return [] as ResponseBody[];
  }

  // 時間順で上位N件を対象とします
  const targets =
    queryResult.Items.length > WORDS_LIMIT
      ? queryResult.Items.slice(WORDS_LIMIT)
      : queryResult.Items;

  const tasks = targets.map(item =>
    client.get(queryItem_words((item as GroupsItem).word as string)).promise()
  );

  const wordsInfo = await Promise.all(tasks);

  console.log(wordsInfo);

  return ([{}] as unknown) as ResponseBody[];

  // // 戻り値に変換する
  // return queryResult.Items.map(
  //   item =>
  //     ({
  //       word: (item as Groups_Item).word
  //     } as ResponseBody)
  // );
};

/**
 * 新規学習単語対象一覧を取得する
 * 対象： Times = 0
 */
const queryItem_groups = (groupId: string) =>
  ({
    TableName: GROUPS_TABLE,
    ProjectionExpression: 'nextTime, word',
    KeyConditionExpression: '#id = :id',
    FilterExpression: '#times = :times',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#times': 'times'
    },
    ExpressionAttributeValues: {
      ':id': groupId,
      ':times': 0
    },
    ScanIndexForward: false
  } as DynamoDB.DocumentClient.QueryInput);

/** 単語情報を取得する */
const queryItem_words = (word: string) =>
  ({
    TableName: WORDS_TABLE,
    Key: {
      word: word
    }
  } as DynamoDB.DocumentClient.GetItemInput);
