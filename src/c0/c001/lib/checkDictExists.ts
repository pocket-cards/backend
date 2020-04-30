import { DBHelper, Logger } from '@utils';
import { WordMaster } from '@queries';

/** 単語が辞書に存在するかのチェック */
export default async (words: string[]) => {
  // 単語存在確認
  const tasks = words.map((item) => DBHelper().get(WordMaster.get(item)));
  const results = await Promise.all(tasks);

  Logger.info('検索結果', results);

  const targets = words.filter((item) => !results.find((r) => r && r.Item.id === item));

  Logger.info('単語の存在チェックは完了しました.');

  return targets;
};
