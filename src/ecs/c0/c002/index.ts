import { Request } from 'express';
import { DBHelper } from '@utils';
import { Words } from '@queries';
import { C002Response, C002Params, C002ResItem } from 'typings/api';
import { TWords } from 'typings/tables';

export default async (req: Request<C002Params, any, any, any>): Promise<C002Response> => {
  const groupId = req.params.groupId;

  const queryResult = await DBHelper().query(Words.query.listByGroup(groupId));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return [] as C002Response;
  }

  return queryResult.Items.map(
    (item) =>
      ({
        word: (item as TWords).id,
        vocabulary: (item as TWords).vocabulary,
      } as C002ResItem)
  );
};
