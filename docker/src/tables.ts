require('dotenv').config();

import { Helper } from 'dynamodb-helper';
import { DynamoDB } from 'aws-sdk';
import { sync } from 'glob';

const AWS_ENDPOINT = process.env.AWS_ENDPOINT;
const DEFAULT_REGION = process.env.DEFAULT_REGION;

const helper = new Helper({
  options: {
    endpoint: AWS_ENDPOINT,
    region: DEFAULT_REGION,
  },
});

const create = async () => {
  const db = new DynamoDB({
    endpoint: AWS_ENDPOINT,
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
