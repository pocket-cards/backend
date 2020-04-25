import { Request } from 'express';
import { DBHelper, Logger, Commons } from '@utils';
import { UserGroups } from '@queries';
import { B003Response, B003Params } from '@typings/api';
import { TUserGroups } from '@typings/tables';

/**
 * グループ情報削除
 *
 * DELETE /groups/:groupId
 */
export default async (req: Request): Promise<B003Response> => {
  const userId = Commons.getUserId(req);
  const groupId = ((req.params as unknown) as B003Params).groupId;

  // 検索
  const results = await DBHelper().delete(UserGroups.get(userId, groupId));

  Logger.info(results);

  return results.Item as TUserGroups;
};
