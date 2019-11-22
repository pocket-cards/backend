import { APIGatewayEvent } from 'aws-lambda';
import { getUserId } from '@utils/utils';
import { isEmpty } from 'lodash';

export default async (event: APIGatewayEvent) => {
  const userId = getUserId(event);

  if (isEmpty(userId)) {
    throw new Error('User id not exists.');
  }
};
