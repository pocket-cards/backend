import { C008Response, WordItem } from '@typings/api';
import { DBHelper, Logger } from '@utils';
import { Words } from '@src/queries';
import { TWords } from '@typings/tables';
import { DynamoDB } from 'aws-sdk';
import { Environment } from '@src/consts';

export default async (req: Request): Promise<C008Response> => {
  // if (!event.pathParameters) {
  //   return EmptyResponse();
  // }

  const groupId = 'null'; //event.pathParameters['groupId'];

  const queryResult = null; //await DBHelper().query(Words.query.queryByGroupId07(groupId));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return EmptyResponse();
  }

  // 時間順で上位N件を対象とします
  const targets = getRandom(queryResult.Items, Environment.WORDS_LIMIT);

  Logger.info('対象単語', targets);
  // 単語明細情報を取得する
  const tasks = targets.map((item) =>
    DBHelper()
      .getRequest(Words.get({ id: '', groupId: '' }))
      .promise()
  );
  const wordsInfo = await Promise.all(tasks);

  Logger.info('検索結果', wordsInfo);

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
      times: item.times,
    } as WordItem);
  });

  return {
    count: items.length,
    words: items,
  };
};

const EmptyResponse = (): C008Response => ({
  count: 0,
  words: [],
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
