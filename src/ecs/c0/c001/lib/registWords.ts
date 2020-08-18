import { AWSError } from 'aws-sdk';
import { DBHelper, DateUtils } from '@utils';
import { Words } from '@queries';

/** Wordsのデータ登録 */
export default async (groupId: string, words: string[]) => {
  // 単語は全部小文字で処理する
  const tasks = words.map((item) =>
    DBHelper().put(
      Words.put({
        id: item,
        groupId: groupId,
        nextTime: DateUtils.getNow(),
        times: 0,
      })
    )
  );

  try {
    // グループ単語登録
    await Promise.all(tasks);
  } catch (err) {
    // キー既存あり以外の場合、エラーとする
    if ((err as AWSError).code !== 'ConditionalCheckFailedException') {
      throw err;
    }
  }
};
