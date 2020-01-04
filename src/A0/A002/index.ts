import { APIGatewayEvent } from 'aws-lambda';
import app from './app';
import validate from './validator';
import { BaseResponse } from '@typings/api';
import { Logger, getResponse } from '@utils/utils';

// イベント入口
export const handler = async (event: APIGatewayEvent): Promise<BaseResponse> => {
  // イベントログ
  Logger.info(event);

  try {
    // 認証
    await validate(event);

    // 本処理
    const result = await app(event);

    // 本処理結果
    Logger.info(result);

    return getResponse(200, JSON.stringify(result));
  } catch (error) {
    // エラーログ
    Logger.error(error);

    return getResponse(500, JSON.stringify(error.message));
  }
};
