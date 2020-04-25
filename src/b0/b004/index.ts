import { Request } from 'express';
import { DBHelper, Logger, Commons } from '@utils';
import { UserGroups } from '@queries';
import { B004Response, B004Params } from '@typings/api';
import { TUserGroups } from '@typings/tables';

export default async (req: Request): Promise<B004Response> => {
  const userId = Commons.getUserId(req);
  const groupId = ((req.params as unknown) as B004Params).groupId;

  // 検索
  const results = await DBHelper().query(UserGroups.get.item(userId, groupId));

  Logger.info(results);

  // ０件
  if (results.Count === 0 || !results.Items) return;

  const items = results.Items as TUserGroups[];

  return items[0];
};
