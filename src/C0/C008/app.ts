import { DynamoDB } from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import { GroupWords } from '@typings/tables';
import { queryItem_words, queryItem_groups } from './db';
import { C008Response, WordItem } from '@typings/api';
import { dbHelper } from '@utils/dbHelper';

// 環境変数
const TABLE_WORDS = process.env.TABLE_WORDS as string;
const TABLE_GROUP_WORDS = process.env.TABLE_GROUP_WORDS as string;
// 最大単語数、default 10件
const WORDS_LIMIT = process.env.WORDS_LIMIT ? Number(process.env.WORDS_LIMIT) : 10;

export default async (event: APIGatewayEvent): Promise<C008Response> => {
  if (!event.pathParameters) {
    return EmptyResponse();
  }

  const groupId = event.pathParameters['groupId'];

  const queryResult = await dbHelper().query(queryItem_groups(TABLE_GROUP_WORDS, groupId));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return EmptyResponse();
  }

  // 時間順で上位N件を対象とします
  const targets = getRandom(queryResult.Items, WORDS_LIMIT);

  console.log('対象単語', targets);
  // 単語明細情報を取得する
  const tasks = targets.map(item =>
    dbHelper()
      .getRequest(queryItem_words(TABLE_WORDS, (item as GroupWords).word as string))
      .promise()
  );
  const wordsInfo = await Promise.all(tasks);

  console.log('検索結果', wordsInfo);

  // 返却結果
  const items: WordItem[] = [];

  targets.forEach((item, idx) => {
    const word = wordsInfo[idx].Item;

    // 明細情報存在しないデータを除外する
    if (!word) return;

    items.push({
      word: word.word,
      mp3: word.mp3,
      pronounce: word.pronounce,
      vocChn: word.vocChn,
      vocJpn: word.vocJpn,
      times: item.times
    } as WordItem);
  });

  return {
    count: items.length,
    words: items
  };
};

const EmptyResponse = (): C008Response => ({
  count: 0,
  words: []
});

const getRandom = (items: DynamoDB.DocumentClient.AttributeMap[], maxItems: number) => {
  if (maxItems >= items.length) {
    return items;
  }

  const results: DynamoDB.DocumentClient.AttributeMap[] = [];

  while (results.length != maxItems) {
    const min = 0;
    const max = items.length - 1;

    const random = Math.floor(Math.random() * (max + 1 - min)) + min;

    results.push(items.splice(random, 1)[0]);
  }

  return results;
};
