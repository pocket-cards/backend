import { APIGatewayEvent } from 'aws-lambda';
import validate from './validator';
import app from './app';
import { BaseResponse } from '@typings/api';
import { getResponse } from '@utils/utils';

// イベント入口
export const handler = async (event: APIGatewayEvent): Promise<BaseResponse> => {
  // イベントログ
  console.log(event);
  console.log(process.env);
  try {
    // 認証
    await validate(event);

    // 本処理
    const result = await app(event);

    // 本処理結果
    console.log(result);

    return getResponse(200, JSON.stringify(result));
  } catch (error) {
    // エラーログ
    console.log(error);

    return getResponse(500, JSON.stringify(error.message));
  }
};
