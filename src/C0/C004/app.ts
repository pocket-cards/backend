import { APIGatewayEvent } from 'aws-lambda';
import { updateItem_groups } from './db';
import { C004Request } from '@typings/api';
import { getNow, getNextTime } from '@utils/utils';
import * as DBUtils from '@utils/dbutils';

// 環境変数
const TABLE_GROUP_WORDS = process.env.TABLE_GROUP_WORDS as string;

export default async (event: APIGatewayEvent): Promise<void> => {
  if (!event.pathParameters || !event.body) {
    return;
  }

  const groupId = event.pathParameters['groupId'];
  const word = event.pathParameters['word'];
  const input = JSON.parse(event.body) as C004Request;

  const lastTime = getNow();

  // 正解の場合
  const times = input.correct ? input.times + 1 : 0;
  const nextTime = input.correct ? getNextTime(input.times) : getNextTime(0);

  await DBUtils.updateAsync(
    updateItem_groups(TABLE_GROUP_WORDS, {
      id: groupId,
      word,
      lastTime,
      nextTime,
      times,
    })
  );
};
