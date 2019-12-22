import { BaseResponse } from '@typings/api';
import app from './app';
import { getResponse, Logger } from '@utils/utils';

// イベント入口
export const handler = async (event: M001Event): Promise<BaseResponse> => {
  // イベントログ
  Logger.info(event);

  try {
    // 本処理
    await app(event);

    return getResponse(200);
  } catch (error) {
    // エラーログ
    Logger.error(error);

    return getResponse(500);
  }
};

export interface M001Event {
  message: string;
}
