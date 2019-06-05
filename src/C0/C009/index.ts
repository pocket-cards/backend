import { APIGatewayEvent, Callback } from 'aws-lambda';
import app from './app';
import validate from './validator';
import { BaseResponse, C008Response } from '@typings/api';

// イベント入口
export const handler = (event: APIGatewayEvent, _: any, callback: Callback<BaseResponse>) => {
  // イベントログ
  console.log(event);

  validate(event)
    .then(() => app(event))
    .then((result: C008Response) => {
      // 終了ログ
      console.log(result);
      callback(null, {
        statusCode: 200,
        isBase64Encoded: false,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(result),
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
