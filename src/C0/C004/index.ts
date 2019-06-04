import { APIGatewayEvent, Callback } from 'aws-lambda';
import { Response } from 'typings/api';
import app from './app';
import validate from './validator';

// イベント入口
export const handler = (event: APIGatewayEvent, _: any, callback: Callback<Response>) => {
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
          'Access-Control-Allow-Origin': '*',
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
          'Access-Control-Allow-Origin': '*',
        },
      });
    });
};
