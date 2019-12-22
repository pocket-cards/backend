import app from './app';
import { getResponse, Logger } from '@utils/utils';
import { BaseResponse } from '@typings/api';
import { SNSRecords } from '@typings/aws';

// イベント入口
export const handler = async (event: SNSRecords): Promise<BaseResponse> => {
  // イベントログ
  Logger.info(JSON.stringify(event));

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
