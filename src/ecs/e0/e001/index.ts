import { Request } from 'express';
import { DBHelper } from '@utils';
import { WordMaster } from '@queries';
import { E001Params, E001Response } from 'typings/api';
import { TWordMaster } from 'typings/tables';

export default async (req: Request<E001Params, any, any, any>): Promise<E001Response> => {
  const word = req.params.word;

  // 単語詳細情報を取得する
  const record = await DBHelper().get(WordMaster.get(word));

  return record.Item as TWordMaster;
};
