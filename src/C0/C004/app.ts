import { APIGatewayEvent } from 'aws-lambda';
import { updateItem_groups, queryItem_userGroups, putItem_history, getItem_groups } from './db';
import { getNow, getNextTime } from '@utils/utils';
import moment = require('moment');
import { C004Request } from '@typings/api';
import { UserGroups, History } from '@typings/tables';
import { dbHelper } from '@utils/dbHelper';

// 環境変数
const TABLE_USER_GROUPS = process.env.TABLE_USER_GROUPS as string;
const TABLE_GROUP_WORDS = process.env.TABLE_GROUP_WORDS as string;
const TABLE_HISTORY = process.env.TABLE_HISTORY as string;

const GROUP_IDS: { [key: string]: string } = {};

export default async (event: APIGatewayEvent): Promise<void> => {
  if (!event.pathParameters || !event.body) {
    return;
  }

  const groupId = event.pathParameters['groupId'];
  const word = event.pathParameters['word'];
  const input = JSON.parse(event.body) as C004Request;

  // 正解の場合
  const times = input.correct ? input.times + 1 : 0;
  const nextTime = input.correct ? getNextTime(input.times) : getNextTime(0);

  // 存在しない場合、検索し、保存する
  if (!Object.keys(GROUP_IDS).includes(groupId)) {
    // ユーザIDを検索する
    const ugResult = await dbHelper().query(queryItem_userGroups(TABLE_USER_GROUPS, groupId));

    if (!ugResult.Items) {
      throw new Error('User info is not exists.');
    }

    // 保存する
    GROUP_IDS[groupId] = ((ugResult.Items[0] as unknown) as UserGroups).userId;
  }

  // 旧イメージ
  const oldImage = await dbHelper().get(getItem_groups(TABLE_GROUP_WORDS, groupId, word));

  const historyItem: History = {
    userId: GROUP_IDS[groupId],
    timestamp: moment().format('YYYYMMDDHHmmssSSS'),
    word,
    groupId,
    times
  };

  // 最終日付が存在する場合、セットする
  if (oldImage.Item && oldImage.Item['lastTime']) {
    historyItem.lastTime = oldImage.Item['lastTime'];
  }

  // 両方更新する
  await dbHelper().transactWrite({
    TransactItems: [
      {
        Update: updateItem_groups(TABLE_GROUP_WORDS, {
          id: groupId,
          word,
          lastTime: getNow(),
          nextTime,
          times
        })
      },
      {
        Put: putItem_history(TABLE_HISTORY, historyItem)
      }
    ]
  });
};
