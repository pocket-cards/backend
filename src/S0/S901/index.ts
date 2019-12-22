import { CognitoUserPoolTriggerEvent } from 'aws-lambda';
import app from './app';
import { Logger } from '@utils/utils';

// イベント入口
export const handler = async (event: CognitoUserPoolTriggerEvent): Promise<CognitoUserPoolTriggerEvent> => {
  // イベントログ
  Logger.info(event);

  // 本処理
  await app(event);

  return event;
};
