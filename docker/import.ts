require('dotenv').config();

import { Helper } from 'dynamodb-helper';
import { DynamoDB } from 'aws-sdk';

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

  // Test
  await db.createTable(require('./tables/Test.json')).promise();
};

const insert = async () => {
  // Table: Test
  await helper.bulk('Test', require('./datas/Test.json'));
};

(async () => {
  await create();

  await insert();
})();
