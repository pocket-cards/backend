import { DynamoDBStreamEvent } from 'aws-lambda';
import { UserGroupsItem } from '@typings/tables';
import { putAsync, queryAsync } from '@utils/dbutils';
import moment = require('moment');
import { putItem_history, queryItem_userGroups } from './db';

// 環境変数
const HISTORY_TABLE = process.env.HISTORY_TABLE as string;
const USER_GROUPS_TABLE = process.env.USER_GROUPS_TABLE as string;

const EVENT_NAME = 'MODIFY';
const GROUP_IDS: { [key: string]: string } = {};

export default async (event: DynamoDBStreamEvent): Promise<void> => {
  // ユーザIDを確認する
  for (const idx in event.Records) {
    const record = event.Records[idx];
    const db = record.dynamodb;
    const newImage = db && db.NewImage;
    const oldImage = db && db.OldImage;

    // 更新以外処理しない
    if (record.eventName !== EVENT_NAME || !db || !newImage || !oldImage) {
      continue;
    }

    const groupId = newImage['id'].S as string;

    // 存在しない場合、検索し、保存する
    if (!Object.keys(GROUP_IDS).includes(groupId)) {
      // ユーザIDを検索する
      const ugResult = await queryAsync(queryItem_userGroups(USER_GROUPS_TABLE, groupId));

      if (!ugResult.Items) continue;

      // 保存する
      GROUP_IDS[groupId] = ((ugResult.Items[0] as unknown) as UserGroupsItem).userId;
    }

    await putAsync(
      putItem_history(HISTORY_TABLE, {
        userId: GROUP_IDS[groupId],
        timestamp: moment().format('YYYYMMDDHHmmssSSS'),
        word: newImage['word'].S,
        groupId: newImage['id'].S,
        lastTime: oldImage['lastTime'] ? oldImage['lastTime'].S : undefined,
        times: Number(newImage['times'].N),
      })
    );
  }
};
