import { Request } from 'express';
import { DBHelper, Logger, Commons } from '@utils';
import { B004Params, B004Request } from 'typings/api';
import { Groups } from '@queries';

/**
 * グループ情報変更
 * PUT /groups/:groupId
 */
export default async (req: Request): Promise<void> => {
  const userId = Commons.getUserId(req);
  const groupId = ((req.params as unknown) as B004Params).groupId;
  const item = req.body as B004Request;

  // データ更新
  await DBHelper().put(
    Groups.put({
      id: groupId,
      userId,
      name: item.name,
      description: item.description,
    })
  );
};
