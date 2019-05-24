import {} from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import { Result } from './index';

const bucket = process.env.IMAGE_BUCKET as string;

export const app = async (event: APIGatewayEvent): Promise<Result> => {
  if (!event.body) {
    return (undefined as unknown) as Result;
  }

  // 重複結果を削除してから返却する
  return {};
};
