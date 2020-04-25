import { Request } from 'express';
import { DBHelper } from '@utils';
import { C002Response } from '@typings/api';
import { GroupWords } from '@src/queries';
import { TGroupWords } from '@typings/tables';

export default async (req: Request): Promise<C002Response[]> => {
  // if (!event.pathParameters) {
  //   return [] as ResponseBody[];
  // }

  // const groupId = event.pathParameters['groupId'];
  const groupId = '1111';

  const queryResult = await DBHelper().query(GroupWords.query.queryByGroupId04(groupId));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return [] as C002Response[];
  }

  // 戻り値に変換する
  return queryResult.Items.map(
    (item) =>
      ({
        word: (item as TGroupWords).word,
      } as C002Response)
  );
};
