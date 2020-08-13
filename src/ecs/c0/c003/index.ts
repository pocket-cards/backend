import { Request } from 'express';
import { C003Response, C003Params } from 'typings/api';
import { DBHelper } from '@utils';
import { Words } from '@queries';
import { TWords } from 'typings/tables';

export default async (req: Request<C003Params, any, any, any>): Promise<C003Response> => {
  const params = req.params;

  const result = await DBHelper().get(Words.get({ id: params.word, groupId: params.groupId }));

  return result.Item as TWords;
};
