import { DynamoDBStreamEvent } from 'aws-lambda';
import { UserGroupsItem } from '@typings/tables';
import { putAsync, queryAsync } from '@utils/dbutils';
import moment = require('moment');
import { putItem_history, queryItem_userGroups } from './db';

// 環境変数
const TABLE_HISTORY = process.env.TABLE_HISTORY as string;
const TABLE_USER_GROUPS = process.env.TABLE_USER_GROUPS as string;

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
      const ugResult = await queryAsync(queryItem_userGroups(TABLE_USER_GROUPS, groupId));

      if (!ugResult.Items) continue;

      // 保存する
      GROUP_IDS[groupId] = ((ugResult.Items[0] as unknown) as UserGroupsItem).userId;
    }

    await putAsync(
      putItem_history(TABLE_HISTORY, {
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
