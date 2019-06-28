import { APIGatewayEvent } from 'aws-lambda';
import { dynamoDB } from '@utils/clientUtils';
import { GroupWordsItem } from '@typings/tables';
import { queryItem_words, queryItem_groups } from './db';
import { C006Response, WordItem } from '@typings/api';
import * as moment from 'moment';
import * as DBUtils from '@utils/dbutils';

// 環境変数
const TABLE_WORDS = process.env.TABLE_WORDS as string;
const TABLE_GROUP_WORDS = process.env.TABLE_GROUP_WORDS as string;
// 最大単語数、default 10件
const WORDS_LIMIT = process.env.WORDS_LIMIT ? Number(process.env.WORDS_LIMIT) : 10;

export default async (event: APIGatewayEvent): Promise<C006Response> => {
  if (!event.pathParameters) {
    return EmptyResponse();
  }

  const groupId = event.pathParameters['groupId'];

  const queryResult = await DBUtils.queryAsync(queryItem_groups(TABLE_GROUP_WORDS, groupId));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return EmptyResponse();
  }

  console.log(`Count: ${queryResult.Count}`);

  const items = queryResult.Items as GroupWordsItem[];

  items.sort((a, b) => {
    if (!a.lastTime && b.lastTime) return 1;
    if (a.lastTime && !b.lastTime) return -1;
    if (a.lastTime === b.lastTime) return 0;

    return moment(a.lastTime).isBefore(moment(b.lastTime)) ? 1 : -1;
  });
  // 時間順で上位N件を対象とします
  const targets = items.length > WORDS_LIMIT ? items.slice(0, WORDS_LIMIT) : items;

  // 単語明細情報を取得する
  const tasks = targets.map(item => DBUtils.get(queryItem_words(TABLE_WORDS, (item as GroupWordsItem).word as string)).promise());
  const wordsInfo = await Promise.all(tasks);

  console.log('検索結果', wordsInfo);

  // 返却結果
  const results: WordItem[] = [];

  targets.forEach((item, idx) => {
    const word = wordsInfo[idx].Item;

    // 明細情報存在しないデータを除外する
    if (!word) return;

    results.push({
      word: word.word,
      mp3: word.mp3,
      pronounce: word.pronounce,
      vocChn: word.vocChn,
      vocJpn: word.vocJpn,
      times: item.times,
    } as WordItem);
  });

  return {
    count: results.length,
    words: results,
  };
};

const EmptyResponse = (): C006Response => ({
  count: 0,
  words: [],
});
