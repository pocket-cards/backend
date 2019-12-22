import { APIGatewayEvent } from 'aws-lambda';
import { BaseResponse } from '@typings/api';
import { app } from './app';
import validate from './validator';
import { getResponse, Logger } from '@utils/utils';

export const handler = async (event: APIGatewayEvent): Promise<BaseResponse> => {
  let res: BaseResponse = {
    statusCode: 500,
    isBase64Encoded: false
  };

  try {
    await validate(event);

    const result = await app(event);

    res = {
      statusCode: 200,
      isBase64Encoded: false,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    Logger.error(error);

    return getResponse(500, JSON.stringify(error.message));
  } finally {
    return res;
  }
};
