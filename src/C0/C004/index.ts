import { APIGatewayEvent, Callback } from 'aws-lambda';
import app from './app';
import validate from './validator';
import { BaseResponse } from '@typings/api';

// イベント入口
export const handler = (event: APIGatewayEvent, _: any, callback: Callback<BaseResponse>) => {
  // イベントログ
  console.log(event);

  validate(event)
    .then(() => app(event))
    .then(() => {
      // 終了ログ
      callback(null, {
        statusCode: 200,
        isBase64Encoded: false,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
        },
      });
    })
    .catch(err => {
      // エラーログ
      console.log(err);
      callback(err, {
        statusCode: 502,
        isBase64Encoded: false,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
        },
      });
    });
};
