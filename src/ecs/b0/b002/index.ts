import { Request } from 'express';
import { DBHelper, Logger, Commons } from '@utils';
import { Groups } from '@queries';
import { B002Response } from 'typings/api';
import { TGroups } from 'typings/tables';

export default async (req: Request): Promise<B002Response> => {
  const userId = Commons.getUserId(req);

  // 検索結果
  const results = await DBHelper().query(Groups.query.byUserId(userId));

  Logger.info(results);

  const items = results.Items;

  // ０件
  if (!items || items.length === 0) {
    return {
      count: 0,
      groups: [],
    };
  }

  return {
    count: items.length,
    groups: items as TGroups[],
  };
};
