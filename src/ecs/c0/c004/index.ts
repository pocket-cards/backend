import { Request } from 'express';
import moment from 'moment';
import { C004Params, C004Response, C004Request } from 'typings/api';
import { DBHelper, DateUtils, Commons } from '@utils';
import { Words, Histories } from '@queries';
import { TWords } from 'typings/tables';

export default async (req: Request<C004Params, any, C004Request, any>): Promise<C004Response> => {
  const { groupId, word } = req.params;
  const input = req.body;
  const userId = Commons.getUserId(req);

  // 正解の場合
  const times = input.correct ? input.times + 1 : 0;
  const nextTime = input.correct ? DateUtils.getNextTime(times) : DateUtils.getNextTime(0);

  const result = await DBHelper().get(
    Words.get({
      id: word,
      groupId,
    })
  );

  // 単語学習情報更新 と 履歴追加
  await DBHelper().transactWrite({
    TransactItems: [
      {
        Update: Words.update.info({
          id: word,
          groupId: groupId,
          nextTime: nextTime,
          times: times,
          lastTime: DateUtils.getNow(),
        }),
      },
      {
        Put: Histories.put({
          user: userId,
          timestamp: moment().format('YYYYMMDDHHmmssSSS'),
          word: word,
          group: groupId,
          times: times,
          lastTime: (result.Item as TWords)?.lastTime,
        }),
      },
    ],
  });
};
