import { AWSError } from 'aws-sdk';
import { DBHelper, DateUtils } from '@utils';
import { Words } from '@queries';
import { TWordMaster } from 'typings/tables';

/** Wordsのデータ登録 */
export default async (groupId: string, words: string[], master: TWordMaster[]) => {
  // 単語は全部小文字で処理する
  const tasks = words.map((id) => {
    const record = master.find((item) => item.id === id);

    if (!record) {
      throw new Error('Word Not Found');
    }

    return DBHelper().put(
      Words.put({
        id: id,
        groupId: groupId,
        nextTime: DateUtils.getNow(),
        times: 0,
        vocabulary: record.vocJpn,
      })
    );
  });

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
