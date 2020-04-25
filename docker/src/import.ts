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

  db.createTable({
    TableName: 'AAAA',
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'userId',
        KeyType: 'RANGE',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S',
      },
      {
        AttributeName: 'userId',
        AttributeType: 'S',
      },
    ],
    BillingMode: 'PROVISIONED',
    ProvisionedThroughput: {
      ReadCapacityUnits: 1000,
      WriteCapacityUnits: 1000,
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: 'gsi1',
        KeySchema: [
          {
            AttributeName: 'userId',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'id',
            KeyType: 'RANGE',
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1000,
          WriteCapacityUnits: 1000,
        },
      },
    ],
  });
  const tasks = files.map((file) => db.createTable(require(file)).promise());

  await Promise.all(tasks);
};

const insert = async () => {
  // Table: Test
  await helper.bulk('Test', require('./datas/Test.json'));
};

(async () => {
  await create();
  // await insert();
})();
