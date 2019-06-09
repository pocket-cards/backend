import { DynamoDB } from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import { dynamoDB } from '@utils/clientUtils';
import { updateItem_groups } from './db';
import { C004Request } from '@typings/api';
import { getNow, getNextTime } from '@utils/utils';

let client: DynamoDB.DocumentClient;

// 環境変数
const GROUPS_TABLE = process.env.GROUPS_TABLE as string;

export default async (event: APIGatewayEvent): Promise<void> => {
  if (!event.pathParameters || !event.body) {
    return;
  }

  const groupId = event.pathParameters['groupId'];
  const word = event.pathParameters['word'];
  const input = JSON.parse(event.body) as C004Request;

  // DynamoDB Client 初期化
  client = dynamoDB(client);

  const lastTime = getNow();
  let nextTime: string;
  let times: number;

  // 正解の場合
  if (input.correct && input.times === 0) {
    times = input.times + 1;
    nextTime = getNextTime(input.times);
  } else {
    // 不正解の場合、今日の新規単語になります
    times = 0;
    nextTime = getNow();
  }

  await client
    .update(
      updateItem_groups(GROUPS_TABLE, {
        id: groupId,
        word,
        lastTime,
        nextTime,
        times,
      })
    )
    .promise();
};
