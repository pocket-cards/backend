import { BaseResponse } from '@typings/api';
import app from './app';
import { getResponse } from '@utils/utils';

// イベント入口
export const handler = async (event: any): Promise<BaseResponse> => {
  // イベントログ
  console.log(JSON.stringify(event));

  try {
    // 本処理
    await app(event);

    return getResponse(200);
  } catch (error) {
    // エラーログ
    console.log(error);

    return getResponse(500);
  }
};
