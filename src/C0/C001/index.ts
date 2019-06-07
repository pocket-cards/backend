import { APIGatewayEvent, Callback } from 'aws-lambda';
import validate from './validator';
import app from './app';
import { BaseResponse } from '@typings/api';

// イベント入口
export const handler = (event: APIGatewayEvent, _: any, callback: Callback<BaseResponse>) => {
  // イベントログ
  console.log(event);

  validate(event)
    .then(() => app(event))
    .then(() => {
      console.log('Success');
      // 終了ログ
      callback(null, {
        statusCode: 200,
        isBase64Encoded: false,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    })
    .catch(err => {
      // エラーログ
      console.log('Error:', err);
      callback(err, {
        statusCode: 502,
        isBase64Encoded: false,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    });
};
