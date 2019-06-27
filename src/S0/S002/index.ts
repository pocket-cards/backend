import { CognitoUserPoolTriggerEvent } from 'aws-lambda';
import app from './app';

// イベント入口
export const handler = async (event: CognitoUserPoolTriggerEvent) => {
  // イベントログ
  console.log(event);

  // 本処理
  await app(event);
};
