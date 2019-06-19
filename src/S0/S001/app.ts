import { DynamoDBStreamEvent } from 'aws-lambda';
import { UserGroupsItem } from '@typings/tables';
import { putAsync, queryAsync } from '@utils/dbutils';
import moment = require('moment');
import { putItem_history, queryItem_userGroups } from './db';

// 環境変数
const HISTORY_TABLE = process.env.HISTORY_TABLE as string;
const USER_GROUPS_TABLE = process.env.USER_GROUPS_TABLE as string;

const EVENT_NAME = 'MODIFY';

export default async (event: DynamoDBStreamEvent): Promise<void> => {
  console.log(process.env);
  const tasks = event.Records.map(async record => {
    const db = record.dynamodb;
    const newImage = db && db.NewImage;

    // 更新以外処理しない
    if (record.eventName !== EVENT_NAME || !db || !newImage) {
      return;
    }

    // 検索結果
    const ugResult = await queryAsync(queryItem_userGroups(USER_GROUPS_TABLE, newImage['id'].S as string));

    console.log('User Search Success...');
    // 検索結果０件
    if (ugResult.Count === 0 || !ugResult.Items) {
      return;
    }

    // 履歴追加する
    await putAsync(
      putItem_history(HISTORY_TABLE, {
        userId: (ugResult.Items[0] as UserGroupsItem).userId,
        timestamp: moment().format('YYYYMMDDHHmmssSSS'),
        word: newImage['word'].S,
        groupId: newImage['id'].S,
        lastTime: newImage['lastTime'].S,
        times: Number(newImage['times'].N),
      })
    );
  });

  await Promise.all(tasks);
};
