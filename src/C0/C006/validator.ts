import { APIGatewayEvent } from 'aws-lambda';

export default (event: APIGatewayEvent) =>
  new Promise((resolve, reject) => {
    resolve();
  });
