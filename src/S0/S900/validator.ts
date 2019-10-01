import { DynamoDBStreamEvent } from 'aws-lambda';

export default (event: DynamoDBStreamEvent) =>
  new Promise((resolve, reject) => {
    resolve();
  });
