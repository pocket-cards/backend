import { APIGatewayEvent } from 'aws-lambda';
import { RequestBody } from './index';

export default (event: APIGatewayEvent) =>
  new Promise((resolve, reject) => {
    resolve();
  });
