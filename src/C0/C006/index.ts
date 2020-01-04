import { APIGatewayEvent, Callback } from 'aws-lambda';
import app from './app';
import validate from './validator';
import { BaseResponse } from '@typings/api';
import { Logger, getResponse } from '@utils/utils';

export const handler = async (event: APIGatewayEvent): Promise<BaseResponse> => {
  // イベントログ
  Logger.info(event);

  try {
    await validate(event);

    const res = await app(event);

    return getResponse(200, JSON.stringify(res));
  } catch (err) {
    Logger.error(err);

    return getResponse(500, err.message);
  }
};
