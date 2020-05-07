import { Request } from 'express';
import { DBHelper, Logger } from 'src/ecs/utils';
import { Commons } from 'src/ecs/utils';
import { Groups } from 'src/ecs/queries';
import { B002Response } from '@typings/api';

export default async (req: Request): Promise<B002Response> => {
  const userId = Commons.getUserId(req);

  // 検索
  const results = await DBHelper().query(Groups.query.byUserId(userId));

  Logger.info(results);

  // ０件
  if (results.Count === 0 || !results.Items) return [];

  return results.Items as B002Response;
};