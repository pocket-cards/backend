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

    // 更新以外処理しない
    if (record.eventName !== EVENT_NAME || !db || !newImage) {
      continue;
    }

    const groupId = newImage['id'].S as string;

    // すでに存在する
    if (Object.keys(GROUP_IDS).includes(groupId)) {
      continue;
    }

    // ユーザIDを検索する
    const ugResult = await queryAsync(queryItem_userGroups(USER_GROUPS_TABLE, groupId));

    if (!ugResult.Items) continue;

    // 保存する
    GROUP_IDS[groupId] = ((ugResult.Items[0] as unknown) as UserGroupsItem).userId;

    await putAsync(
      putItem_history(HISTORY_TABLE, {
        userId: GROUP_IDS[groupId],
        timestamp: moment().format('YYYYMMDDHHmmssSSS'),
        word: newImage['word'].S,
        groupId: newImage['id'].S,
        lastTime: newImage['lastTime'].S,
        times: Number(newImage['times'].N),
      })
    );
  }
};
