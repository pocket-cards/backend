import { DynamoDB } from 'aws-sdk';

const start = async () => {
  const client = new DynamoDB.DocumentClient({
    region: 'ap-northeast-1',
  });

  const queryResult = await client.query(queryItem_groups('PocketCards_GroupWords', 'x001')).promise();

  if (!queryResult.Items) return;

  for (const idx in queryResult.Items) {
    const item = queryResult.Items[idx];

    await client.update(updateItem_groups('PocketCards_GroupWords', 'x001', item.word)).promise();

    console.log(111);
  }
};

export const queryItem_groups = (table: string, groupId: string) =>
  ({
    TableName: table,
    ProjectionExpression: 'word',
    KeyConditionExpression: '#id = :id',
    FilterExpression: '#times <> :times',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#times': 'times',
    },
    ExpressionAttributeValues: {
      ':id': groupId,
      ':times': 0,
    },
  } as DynamoDB.DocumentClient.QueryInput);

export const updateItem_groups = (table: string, id: string, word: string) =>
  ({
    TableName: table,
    Key: {
      id,
      word,
    },
    UpdateExpression: 'set #times = :times',
    ExpressionAttributeNames: {
      '#times': 'times',
    },
    ExpressionAttributeValues: {
      ':times': 0,
    },
  } as DynamoDB.DocumentClient.UpdateItemInput);

start();
