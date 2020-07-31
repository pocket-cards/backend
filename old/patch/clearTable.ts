import { PromiseResult } from 'aws-sdk/lib/request';
import { DynamoDB, AWSError } from 'aws-sdk';
import { scanAsync, deleteItemAsync } from '../src/Z0/dbutils';

const TABLE_NAME = 'PocketCards_GroupWords';

const start = async () => {
  const results = await scanAsync({
    TableName: TABLE_NAME,
  });

  console.log(results.Count);

  if (!results.Items) {
    return;
  }

  const items: Promise<PromiseResult<DynamoDB.DocumentClient.DeleteItemOutput, AWSError>>[] = [];

  for (let idx in results.Items) {
    const item = results.Items[idx];

    items.push(
      deleteItemAsync({
        TableName: TABLE_NAME,
        Key: {
          id: item['id'],
          word: item['word'],
        },
      })
    );

    if (items.length === 50) {
      await Promise.all(items);

      items.length = 0;
    }
  }
};

start();
