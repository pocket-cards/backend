import { APIGatewayEvent, Callback } from 'aws-lambda';
import app from './app';
import validate from './validator';
import { GroupWords } from '@typings/tables';
import { BaseResponse, C007Response } from '@typings/api';
import { Logger } from '@utils/utils';

// イベント入口
export const handler = (event: APIGatewayEvent, _: any, callback: Callback<BaseResponse>) => {
  // イベントログ
  Logger.info(event);

  validate(event)
    .then(() => app(event))
    .then((result: C007Response) => {
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
      Logger.info(err);
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

export interface Response {
  statusCode: number;
  headers?: {
    [key: string]: string;
  };
  isBase64Encoded: boolean;
  body?: string;
}

export interface RequestBody {
  words: string[];
}

export interface ResponseBody extends GroupWords {}
