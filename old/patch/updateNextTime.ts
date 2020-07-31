import { DynamoDB } from 'aws-sdk';

const start = async () => {
  const client = new DynamoDB.DocumentClient({
    region: 'ap-northeast-1',
  });

  const queryResult = await client.query(queryItem_groups('PocketCards_GroupWords', 'x001')).promise();

  console.log(queryResult);
  if (!queryResult.Items) return;

  for (const idx in queryResult.Items) {
    const item = queryResult.Items[idx];

    await client.update(updateItem_groups('PocketCards_GroupWords', 'x001', item.word)).promise();
  }
};

export const queryItem_groups = (table: string, groupId: string) =>
  ({
    TableName: table,
    ProjectionExpression: 'word',
    KeyConditionExpression: '#id = :id',
    FilterExpression: '#nextTime = :nextTime',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#nextTime': 'nextTime',
    },
    ExpressionAttributeValues: {
      ':id': groupId,
      ':nextTime': '20190611000000',
    },
  } as DynamoDB.DocumentClient.QueryInput);

export const updateItem_groups = (table: string, id: string, word: string) =>
  ({
    TableName: table,
    Key: {
      id,
      word,
    },
    UpdateExpression: 'set #nextTime = :nextTime',
    ExpressionAttributeNames: {
      '#nextTime': 'nextTime',
    },
    ExpressionAttributeValues: {
      ':nextTime': '20190611',
    },
  } as DynamoDB.DocumentClient.UpdateItemInput);

start();
