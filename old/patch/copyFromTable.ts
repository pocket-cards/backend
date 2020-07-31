import { DynamoDB, AWSError } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

const client = new DynamoDB.DocumentClient({
  region: 'ap-northeast-1',
});

const TABLE_FROM = 'Groups';
const TABLE_TO = 'PocketCards_GroupWords';

const start = async () => {
  const result = await scanAsync({ TableName: TABLE_FROM });

  if (!result.Items) return;

  const items: Promise<PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWSError>>[] = [];

  for (let idx in result.Items) {
    const item = result.Items[idx];

    items.push(
      putAsync({
        TableName: TABLE_TO,
        Item: item,
      })
    );

    if (items.length === 50) {
      await Promise.all(items);

      items.length = 0;
    }
  }

  await Promise.all(items);
};

export const scan = (input: DynamoDB.DocumentClient.QueryInput) => {
  console.log(input);

  return client.scan(input);
};

export const scanAsync = async (input: DynamoDB.DocumentClient.QueryInput) => {
  // クエリ実行
  const result = await scan(input).promise();

  // 検索結果出力
  console.log(result);

  if (result.LastEvaluatedKey) {
    const lastResult = await scanAsync({ ...input, ExclusiveStartKey: result.LastEvaluatedKey });

    if (result.Items && lastResult.Items) {
      result.Items = result.Items.concat(lastResult.Items);
    }
    if (result.Count && lastResult.Count) {
      result.Count = result.Count + lastResult.Count;
    }
    if (result.ScannedCount && lastResult.ScannedCount) {
      result.ScannedCount = result.ScannedCount + lastResult.ScannedCount;
    }
  }

  return result;
};

export const put = (input: DynamoDB.DocumentClient.PutItemInput) => {
  console.log(input);

  return client.put(input);
};

export const putAsync = async (input: DynamoDB.DocumentClient.PutItemInput) => {
  const result = put(input).promise();

  console.log(result);

  return result;
};

start();
