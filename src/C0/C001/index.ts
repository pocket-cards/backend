import { APIGatewayEvent, Callback } from 'aws-lambda';
import validate from './validator';
import app from './app';

// イベント入口
export const handler = (event: APIGatewayEvent, _: any, callback: Callback<Response>) => {
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
        },
      } as Response);
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

export interface ResponseBody {}
