import { DynamoDBStreamEvent } from 'aws-lambda';
import app from './app';
import validate from './validator';
import { Logger } from '@utils/utils';

// イベント入口
export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  // イベントログ
  Logger.info(event);

  try {
    // 認証
    await validate(event);

    // 本処理
    const result = await app(event);

    // 本処理結果
    Logger.info(result);

    return;
  } catch (error) {
    // エラーログ
    Logger.error(error);

    throw error;
  }
};
