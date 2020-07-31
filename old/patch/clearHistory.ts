import { Polly, S3, DynamoDB, AWSError } from 'aws-sdk';
import * as short from 'short-uuid';
import * as moment from 'moment';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { queryAsync, deleteItemAsync } from '../src/Z0/dbutils';
import { PromiseResult } from 'aws-sdk/lib/request';

const PATH_PATTERN = 'audio';
const MP3_BUCKET = 'pocket-cards-mp3';
const REGION = 'ap-northeast-1';

const start = async () => {
  const results = await queryAsync({
    TableName: 'PocketCards_History',
    ProjectionExpression: '#timestamp',
    KeyConditionExpression: '#userId = :userId and begins_with(#timestamp, :timestamp)',
    ExpressionAttributeNames: {
      '#userId': 'userId',
      '#timestamp': 'timestamp',
    },
    ExpressionAttributeValues: {
      ':userId': 'wwalpha',
      ':timestamp': '20190627',
    },
  });

  console.log(results.Count);

  if (!results.Items) {
    return;
  }

  // const items: Promise<PromiseResult<DynamoDB.DocumentClient.DeleteItemOutput, AWSError>>[] = [];

  // for (let idx in results.Items) {
  //   const item = results.Items[idx];

  //   items.push(
  //     deleteItemAsync({
  //       TableName: 'PocketCards_History',
  //       Key: {
  //         userId: 'wwalpha',
  //         timestamp: item['timestamp'],
  //       },
  //     })
  //   );

  //   if (items.length === 50) {
  //     await Promise.all(items);

  //     items.length = 0;
  //   }
  // }
};

start();
