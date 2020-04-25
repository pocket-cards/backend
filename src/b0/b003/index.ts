import { Request } from 'express';
import { DBHelper, Logger, Commons } from '@utils';
import { B003Response, B003Params } from '@typings/api';
import { Groups } from '@src/queries';

/**
 * グループ情報削除
 *
 * DELETE /groups/:groupId
 */
export default async (req: Request): Promise<void> => {
  const userId = Commons.getUserId(req);
  const groupId = ((req.params as unknown) as B003Params).groupId;

  // 検索
  const results = await DBHelper().delete(Groups.get(groupId, userId));

  Logger.info(results);
};
