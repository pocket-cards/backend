import { Request } from 'express';
import { C004Params, C004Response, C004Request } from 'typings/api';
import { Commons } from '@utils';
import study from './study';
import update from './update';

export default async (req: Request<C004Params, any, C004Request, any>): Promise<C004Response> => {
  const input = req.body;
  const userId = Commons.getUserId(req);

  // 学習カード
  if (input.type === '1') {
    // 学習カード
    study(req.params, input, userId);
  }

  // 単語更新
  if (input.type === '2') {
    update(req.params, input);
  }
};
