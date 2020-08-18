import { Request } from 'express';
import { DBHelper, Logger } from '@utils';
import { Environment } from '@consts';
import { Words, WordMaster } from '@queries';
import { TWords, TWordMaster } from 'typings/tables';
import { C008Response, WordItem, C008Params } from 'typings/api';

export default async (req: Request): Promise<C008Response> => {
  const params = (req.params as unknown) as C008Params;
  const groupId = params.groupId;

  const queryResult = await DBHelper().query(Words.query.review(groupId));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return EmptyResponse();
  }

  const items = queryResult.Items as TWords[];
  // 時間順で上位N件を対象とします
  const targets = getRandom(items, Environment.WORDS_LIMIT);
  // 単語明細情報の取得
  const results = await getDetails(targets);

  return {
    count: results.length,
    words: results,
  };
};

const EmptyResponse = (): C008Response => ({
  count: 0,
  words: [],
});

const getRandom = (items: TWords[], maxItems: number): TWords[] => {
  if (maxItems >= items.length) {
    return items;
  }

  const results: TWords[] = [];

  while (results.length != maxItems) {
    const min = 0;
    const max = items.length - 1;

    const random = Math.floor(Math.random() * (max + 1 - min)) + min;

    results.push(items.splice(random, 1)[0]);
  }

  return results;
};

/** 単語明細情報の取得 */
const getDetails = async (words: TWords[]) => {
  const tasks = words.map((item) => DBHelper().get(WordMaster.get(item.id)));
  const details = (await Promise.all(tasks)).filter((item) => item);

  Logger.info('検索結果', details);

  // 返却結果
  const rets: WordItem[] = [];

  words.forEach((t) => {
    const finded = details.find((w) => (w.Item as TWordMaster).id === t.id);

    // 明細情報存在しないデータを除外する
    if (!finded) return;

    const item = finded.Item as TWordMaster;

    rets.push({
      word: item.id,
      mp3: item.mp3,
      pronounce: item.pronounce,
      vocChn: item.vocChn,
      vocJpn: item.vocJpn,
      times: t.times,
    } as WordItem);
  });

  return rets;
};
