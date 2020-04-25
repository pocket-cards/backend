import { Request } from 'express';
import { DBHelper, Logger, Commons } from '@utils';
import { UserGroups } from '@queries';
import { B004Params, B004Request } from '@typings/api';

/**
 * グループ情報変更
 * PUT /groups/:groupId
 */
export default async (req: Request): Promise<void> => {
  const userId = Commons.getUserId(req);
  const groupId = ((req.params as unknown) as B004Params).groupId;
  const item = req.body as B004Request;

  // データ更新
  const results = await DBHelper().put(
    UserGroups.put({
      userId,
      groupId,
      groupName: item.groupName,
      description: item.description,
    })
  );

  Logger.info(results);
};
