import { DynamoDB } from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import { dynamoDB } from '@utils/clientUtils';
import { GroupsItem, WordsItem } from '@typings/tables';
import { ResponseBody } from './index';
import { queryItem_words, queryItem_groups } from './db';

let client: DynamoDB.DocumentClient;

// 環境変数
const WORDS_TABLE = process.env.WORDS_TABLE as string;
const GROUPS_TABLE = process.env.GROUPS_TABLE as string;
// 最大単語数、default 10件
const WORDS_LIMIT = process.env.WORDS_LIMIT ? Number(process.env.WORDS_LIMIT) : 10;

export default async (event: APIGatewayEvent): Promise<ResponseBody[]> => {
  if (!event.pathParameters) {
    return [] as ResponseBody[];
  }

  const groupId = event.pathParameters['groupId'];

  // DynamoDB Client 初期化
  client = dynamoDB(client);

  const queryResult = await client.query(queryItem_groups(GROUPS_TABLE, groupId)).promise();

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return [] as ResponseBody[];
  }

  // 時間順で上位N件を対象とします
  const targets = queryResult.Items.length > WORDS_LIMIT ? queryResult.Items.slice(WORDS_LIMIT) : queryResult.Items;

  // 単語明細情報を取得する
  const tasks = targets.map(item => client.get(queryItem_words(WORDS_TABLE, (item as GroupsItem).word as string)).promise());

  const wordsInfo = await Promise.all(tasks);

  // 明細情報存在しないデータを除外する
  const res = wordsInfo.reduce(
    (prev, curr) => {
      if (!curr.Item) return prev;

      prev.push(curr.Item as ResponseBody);
      return prev;
    },
    [] as ResponseBody[]
  );

  return res;
};
