import { APIGatewayEvent, Callback } from 'aws-lambda';
import validate from './validator';
import app from './app';
import { BaseResponse } from '@typings/api';
import { Logger } from '@utils/utils';

// イベント入口
export const handler = (event: APIGatewayEvent, _: any, callback: Callback<BaseResponse>) => {
  // イベントログ
  Logger.info(event);

  validate(event)
    .then(() => app(event))
    .then(() => {
      Logger.info('Success');
      // 終了ログ
      callback(null, {
        statusCode: 200,
        isBase64Encoded: false,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    })
    .catch(err => {
      // エラーログ
      Logger.info('Error:', err);
      callback(err, {
        statusCode: 500,
        isBase64Encoded: false,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    });
};
