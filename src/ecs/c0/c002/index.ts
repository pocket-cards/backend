import { Request } from 'express';
import { DBHelper } from '@utils';
import { Words, WordMaster } from '@queries';
import { C002Response, C002Params, C002ResItem } from 'typings/api';
import { TWords, TWordMaster } from 'typings/tables';

export default async (req: Request<C002Params, any, any, any>): Promise<C002Response> => {
  const groupId = req.params.groupId;

  const queryResult = await DBHelper().query(Words.query.listByGroup(groupId));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return [] as C002Response;
  }

  const tasks = queryResult.Items.map((item) => DBHelper().get(WordMaster.get((item as TWords).id)));

  const results = await Promise.all(tasks);

  // 戻り値に変換する
  return results
    .map((item) => {
      // 単語存在しない
      if (!item || !item.Item) return null;

      const wm = item.Item as TWordMaster;

      return {
        word: wm.id,
        vocabulary: wm.vocJpn,
      } as C002ResItem;
    })
    .filter((item) => item !== null);
};
