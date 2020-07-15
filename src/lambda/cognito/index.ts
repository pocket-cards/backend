import { CognitoUserPoolTriggerEvent } from 'aws-lambda';
import app from './app';

// イベント入口
export const handler = async (event: CognitoUserPoolTriggerEvent) => {
  console.log(event);

  try {
    return await app(event);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
