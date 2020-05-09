import { Request } from 'express';
import { DBHelper, Logger, Commons } from '@utils';
import { Groups } from '@queries';
import { TGroups } from 'typings/tables';
import { B003Response, B003Params } from 'typings/api';

/**
 * グループ情報検索
 *
 * GET /groups/:groupId
 */
export default async (req: Request): Promise<B003Response> => {
  const userId = Commons.getUserId(req);
  const groupId = ((req.params as unknown) as B003Params).groupId;

  // 検索
  const results = await DBHelper().get(Groups.get({ id: groupId, userId }));

  Logger.info(results);

  return results.Item as TGroups;
};
