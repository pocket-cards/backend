import { APIGatewayEvent, Callback } from 'aws-lambda';
import app from './app';
import validate from './validator';
import { BaseResponse } from '@typings/api';
import { Logger } from '@utils/utils';

// イベント入口
export const handler = (event: APIGatewayEvent, _: any, callback: Callback<BaseResponse>) => {
  // イベントログ
  Logger.info(event);

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
          'Access-Control-Allow-Methods': '*'
        }
      });
    })
    .catch(err => {
      // エラーログ
      Logger.info(err);
      callback(err, {
        statusCode: 500,
        isBase64Encoded: false,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*'
        }
      });
    });
};
