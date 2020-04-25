import moment from 'moment';
import { DBHelper, Logger, DateUtils } from '@utils';
import { GroupWords, Words } from '@queries';
import { TGroupWords } from '@typings/tables';
import { C006Response, WordItem } from '@typings/api';
import { Environment } from '@src/consts';

export default async (req: Request): Promise<C006Response> => {
  // if (!event.pathParameters) {
  //   return EmptyResponse();
  // }

  const groupId = 'null'; //event.pathParameters['groupId'];

  const queryResult = await DBHelper().query(GroupWords.query.queryByGroupId08(groupId, DateUtils.getNow()));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return EmptyResponse();
  }

  Logger.info(`Count: ${queryResult.Count}`);

  const items = queryResult.Items as TGroupWords[];

  items.sort((a, b) => {
    if (!a.lastTime && b.lastTime) return 1;
    if (a.lastTime && !b.lastTime) return -1;
    if (a.lastTime === b.lastTime) return 0;

    return moment(a.lastTime).isBefore(moment(b.lastTime)) ? 1 : -1;
  });
  // 時間順で上位N件を対象とします
  const targets = items.length > Environment.WORDS_LIMIT ? items.slice(0, Environment.WORDS_LIMIT) : items;

  // 単語明細情報を取得する
  const tasks = targets.map((item) =>
    DBHelper()
      .getRequest(Words.getItem((item as TGroupWords).word as string))
      .promise()
  );
  const wordsInfo = await Promise.all(tasks);

  Logger.info('検索結果', wordsInfo);

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
