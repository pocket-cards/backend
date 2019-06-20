import { APIGatewayEvent } from 'aws-lambda';
import app from './app';
import validate from './validator';
import { BaseResponse } from '@typings/api';

// イベント入口
export const handler = async (event: APIGatewayEvent): Promise<BaseResponse> => {
  // イベントログ
  console.log(event);

  try {
    // 認証
    await validate(event);

    // 本処理
    const result = await app(event);

    // 本処理結果
    console.log(result);

    return {
      statusCode: 200,
      isBase64Encoded: false,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    // エラーログ
    console.log(error);

    return {
      statusCode: 502,
      isBase64Encoded: false,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};
