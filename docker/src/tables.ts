require('dotenv').config();

import { Helper } from 'dynamodb-helper';
import { DynamoDB } from 'aws-sdk';
import { sync } from 'glob';

const DYNAMO_ENDPOINT = process.env.DYNAMO_ENDPOINT;
const DEFAULT_REGION = process.env.DEFAULT_REGION;

const helper = new Helper({
  options: {
    endpoint: DYNAMO_ENDPOINT,
    region: DEFAULT_REGION,
  },
});

const create = async () => {
  const db = new DynamoDB({
    endpoint: DYNAMO_ENDPOINT,
    region: DEFAULT_REGION,
  });

  const files = sync('tables/*', {
    absolute: true,
  });

  const tasks = files.map((file) => db.createTable(require(file)).promise());

  await Promise.all(tasks);
};

(async () => {
  await create();
})();
