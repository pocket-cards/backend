import { Polly, S3, DynamoDB } from 'aws-sdk';
import * as short from 'short-uuid';
import * as moment from 'moment';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';

const PATH_PATTERN = 'audio';
const MP3_BUCKET = 'pocket-cards-mp3';
const REGION = 'ap-northeast-1';

const start = async () => {
  const client = new DynamoDB.DocumentClient({
    region: REGION,
  });

  let items;
  while (true) {
    const results = await client
      .scan({
        TableName: 'PocketCards_Words',
        ProjectionExpression: 'word,vocChn,pronounce',
      })
      .promise();

    console.log(results.Count);
    if (!results.Items) {
      break;
    }

    items = results.Items;
    console.log(results.LastEvaluatedKey);

    if (!results.LastEvaluatedKey) {
      break;
    }
  }

  // console.log(items);
  for (const idx in items) {
    const item = items[idx];
    const word = item.word;
    const vocChn = item.vocChn;

    // console.log(item);
    if (word !== vocChn || item.pronounce) {
      continue;
    }
    console.log(item);

    await client
      .delete({
        TableName: 'PocketCards_Words',
        Key: {
          word,
        },
      })
      .promise();
  }
};

start();
