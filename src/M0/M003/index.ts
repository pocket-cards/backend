import { BaseResponse } from '@typings/api';
import app from './app';
import { getResponse, Logger } from '@utils/utils';

// イベント入口
export const handler = async (event: any): Promise<BaseResponse> => {
  // イベントログ
  Logger.info(event);

  try {
    // 本処理
    await app(event);

    return getResponse(200);
  } catch (error) {
    // エラーログ
    Logger.info(error);

    return getResponse(500);
  }
};
