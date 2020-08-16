import { Request } from 'express';
import { C005Response, C005Params } from 'typings/api';
import { DBHelper } from '@utils';
import { Words } from '@queries';

export default async (req: Request<C005Params, any, any, any>): Promise<C005Response> => {
  const params = req.params;

  await DBHelper().delete(Words.del({ id: params.word, groupId: params.groupId }));
};
