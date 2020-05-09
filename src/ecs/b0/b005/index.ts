import { Request } from 'express';
import { DBHelper, Logger, Commons } from '@utils';
import { Groups } from '@queries';
import { B005Params } from 'typings/api';

/**
 * グループ情報変更
 * PUT /groups/:groupId
 */
export default async (req: Request): Promise<void> => {
  const userId = Commons.getUserId(req);
  const groupId = ((req.params as unknown) as B005Params).groupId;

  // データ更新
  await DBHelper().delete(
    Groups.del({
      id: groupId,
      userId: userId,
    })
  );
};
