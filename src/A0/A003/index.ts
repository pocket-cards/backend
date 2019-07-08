import { CognitoUserPoolTriggerEvent } from 'aws-lambda';
import app from './app';

// イベント入口
export const handler = async (event: CognitoUserPoolTriggerEvent): Promise<CognitoUserPoolTriggerEvent> => {
  // イベントログ
  console.log(event);

  // 本処理
  await app(event);

  return event;
};
