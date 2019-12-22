import { APIGatewayEvent, Callback } from 'aws-lambda';
import { BaseResponse, D001Response } from '@typings/api';
import { app } from './app';
import validate from './validator';
import { Logger } from '@utils/utils';

// イベント入口
export const handler = (event: APIGatewayEvent, _: any, callback: Callback<BaseResponse>) => {
  // イベントログ
  Logger.info(event);

  validate(event)
    .then(() => app(event))
    .then((result: D001Response) => {
      // 終了ログ
      Logger.info(result);
      callback(null, {
        statusCode: 200,
        isBase64Encoded: false,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result)
      });
    })
    .catch(err => {
      // エラーログ
      console.error('Error', err);
      callback(err, {
        statusCode: 500,
        isBase64Encoded: false,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    });
};
