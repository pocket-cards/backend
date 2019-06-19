import { DynamoDBStreamEvent } from 'aws-lambda';
import app from './app';
import validate from './validator';

// イベント入口
export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  // イベントログ
  console.log(event);

  try {
    // 認証
    await validate(event);

    // 本処理
    const result = await app(event);

    // 本処理結果
    console.log(result);

    return;
  } catch (error) {
    // エラーログ
    console.log(error);

    throw error;
  }
};
