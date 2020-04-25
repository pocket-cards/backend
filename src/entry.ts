import { Request, Response } from 'express';
import { Logger } from '@utils';

export default async (req: Request, res: Response, callback: any) => {
  // イベントログ;
  Logger.info(req.headers);
  Logger.info(req.body);

  try {
    // 認証
    // await validate(event);
    // 本処理
    const result = await callback(req);

    // 本処理結果
    Logger.info(result);

    res.status(200).send(result);
  } catch (error) {
    // エラーログ
    Logger.error(error);

    res.status(500).send(error);
  }
};
