import { Request } from 'express';
import { DBHelper, Commons } from '@utils';
import { B001Request, B001Response } from 'typings/api';
import { Groups } from '@queries';
import { generate } from 'short-uuid';
/**
 * グループ情報変更
 * PUT /groups/:groupId
 */
export default async (req: Request): Promise<B001Response> => {
  const userId = Commons.getUserId(req);
  const item = req.body as B001Request;
  const uuid = generate();

  // データ更新
  const ret = await DBHelper().put(
    Groups.put({
      id: uuid,
      userId,
      name: item.name,
      description: item.description,
    })
  );

  return {
    groupId: uuid,
  };
};
