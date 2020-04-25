import { C007Response, WordItem } from '@typings/api';
import { DBHelper, Logger, DateUtils } from '@utils';
import { Words, GroupWords } from '@src/queries';
import { TGroupWords } from '@typings/tables';

export default async (req: Request): Promise<C007Response> => {
  // if (!event.pathParameters) {
  //   return EmptyResponse();
  // }

  const groupId = 'null';

  // テスト単語一覧を取得する
  const queryResult = await DBHelper().query(GroupWords.query.queryByGroupId06(groupId, DateUtils.getNow()));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return EmptyResponse();
  }

  // 時間順で上位N件を対象とします
  const targets = queryResult.Items.length > WORDS_LIMIT ? queryResult.Items.slice(0, WORDS_LIMIT) : queryResult.Items;

  // 単語明細情報を取得する
  const tasks = targets.map((item) => DBHelper().get(Words.getItem((item as TGroupWords).word as string)));
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

const EmptyResponse = (): C007Response => ({
  count: 0,
  words: [],
});
