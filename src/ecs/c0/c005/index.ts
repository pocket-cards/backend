import { Request } from 'express';
import { C005Response, C005Params } from 'typings/api';
import { DBHelper } from '@utils';
import { Groups, Words } from '@queries';
import { getUserId } from '@src/utils/commons';

export default async (req: Request<C005Params, any, any, any>): Promise<C005Response> => {
  const params = req.params;
  const userId = getUserId(req);

  DBHelper().transactWrite({
    TransactItems: [
      {
        // 単語情報削除
        Delete: Words.del({ id: params.word, groupId: params.groupId }),
      },
      {
        // グループ単語数更新
        Update: Groups.update.minusCount(params.groupId, userId, 1),
      },
    ],
  });
};
