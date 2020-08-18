import { Request } from 'express';
import orderBy from 'lodash/orderBy';
import { DBHelper, Logger, DateUtils } from '@utils';
import { Environment } from '@consts';
import { Words, WordMaster } from '@queries';
import { TWords, TWordMaster } from 'typings/tables';
import { C006Response, WordItem, C006Params } from 'typings/api';

export default async (req: Request<C006Params, any, any, any>): Promise<C006Response> => {
  const groupId = req.params.groupId;

  const queryResult = await DBHelper().query(Words.query.news(groupId, DateUtils.getNow()));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return EmptyResponse();
  }

  Logger.info(`Count: ${queryResult.Count}`);

  const items = queryResult.Items as TWords[];
  // 時間順
  const sorted = orderBy(items, 'lastTime');
  // 時間順で上位N件を対象とします
  const targets = sorted.length > Environment.WORDS_LIMIT ? items.slice(0, Environment.WORDS_LIMIT) : items;
  // 単語明細情報の取得
  const results = await getDetails(targets);

  return {
    count: results.length,
    words: results,
  };
};

const EmptyResponse = (): C006Response => ({
  count: 0,
  words: [],
});

/** 単語明細情報の取得 */
const getDetails = async (words: TWords[]) => {
  // 単語明細情報を取得する
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
