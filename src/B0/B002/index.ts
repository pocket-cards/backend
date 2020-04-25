import { Request } from 'express';
import { B002Response } from '@typings/api';
import { DBHelper, Logger } from '@utils';
import { UserGroups } from '@queries';

export default async (req: Request): Promise<B002Response> => {
  // const userId = getUserId(event);

  const userId = 'wwalpha';
  // 検索
  const results = await DBHelper().query(UserGroups.queryByUserId01(userId));

  Logger.info(results);

  // ０件
  if (results.Count === 0 || !results.Items) return [];

  return results.Items as B002Response;
};
