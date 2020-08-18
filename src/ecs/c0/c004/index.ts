import { Request } from 'express';
import { C004Params, C004Response, C004Request } from 'typings/api';
import { DBHelper, DateUtils } from '@utils';
import { Words } from '@queries';

export default async (req: Request<C004Params, any, C004Request, any>): Promise<C004Response> => {
  const { groupId, word } = req.params;
  const input = req.body;

  // 正解の場合
  const times = input.correct ? input.times + 1 : 0;
  const nextTime = input.correct ? DateUtils.getNextTime(times) : DateUtils.getNextTime(0);

  // 単語学習情報更新
  await DBHelper().update(
    Words.update.info({
      id: word,
      groupId: groupId,
      nextTime: nextTime,
      times: times,
      lastTime: DateUtils.getNow(),
    })
  );
};
