import { CognitoUserPoolTriggerEvent } from 'aws-lambda';
import { getItem_users, queryItem_userGroups, queryItem_groups, updateItem_users, queryItem_groupsOnly, updateItem_groupWords } from './db';
import { getAsync, queryAsync, updateAsync } from '@utils/dbutils';
import { UsersItem, UserGroupsItem, GroupWordsItem } from '@typings/tables';
import { getNow, sleep } from '@utils/utils';
import moment = require('moment');
import { DynamoDB } from 'aws-sdk';

// 環境変数
const TABLE_USERS = process.env.TABLE_USERS as string;
const TABLE_USER_GROUPS = process.env.TABLE_USER_GROUPS as string;
const TABLE_GROUP_WORDS = process.env.TABLE_GROUP_WORDS as string;

export default async (event: CognitoUserPoolTriggerEvent): Promise<void> => {
  const { userName } = event;

  if (!userName) throw new Error('UserNameが存在しません。');

  // ユーザ情報検索
  const userInfo = await getAsync(getItem_users(TABLE_USERS, userName));

  // ユーザ情報が存在しない
  if (!userInfo.Item) return;

  const { studyQuery, id } = userInfo.Item as UsersItem;

  // すでに当日の場合、そのまま終了する
  if (studyQuery === getNow()) {
    return;
  }

  const userGroupsInfo = await queryAsync(queryItem_userGroups(TABLE_USER_GROUPS, id));

  // ユーザグループ情報が存在しない
  if (!userGroupsInfo.Items || userGroupsInfo.Count === 0) return;

  let maxDate = '00000000';

  for (let idx in userGroupsInfo.Items) {
    const { groupId } = userGroupsInfo.Items[idx] as UserGroupsItem;

    // 最後の学習日を取得する
    const groupInfo = await queryAsync(queryItem_groupsOnly(TABLE_GROUP_WORDS, groupId));

    // データが存在しない
    if (!groupInfo.Items || groupInfo.Count === 0) {
      continue;
    }

    const { lastTime } = groupInfo.Items[0] as GroupWordsItem;

    // 最大日付を計算する
    if (lastTime) {
      maxDate = Number(maxDate) >= Number(lastTime) ? maxDate : lastTime;
    }
  }

  // 差異日数を計算する
  const diff = moment(getNow(), 'YYYYMMDD').diff(moment(maxDate, 'YYYYMMDD'), 'days') - 1;

  console.log(`差異日数: ${diff}`);

  // スキップの日数がない
  if (diff === 0) {
    return;
  }

  // ユーザ情報を更新する
  await updateAsync(updateItem_users(TABLE_USERS, userName, getNow()));

  try {
    await updateTable(100);

    for (let idx in userGroupsInfo.Items) {
      const { groupId } = userGroupsInfo.Items[idx] as UserGroupsItem;

      // 学習履歴ある単語を全部取得する
      const groupInfo = await queryAsync(queryItem_groups(TABLE_GROUP_WORDS, groupId));
      console.log(`対象件数: ${groupInfo.Count}`);

      // データが存在しない
      if (groupInfo.Count === 0 || !groupInfo.Items) {
        continue;
      }

      const items = groupInfo.Items;

      for (let count = 0; items.length > count; ) {
        const newItems = items.splice(0, 50);
        console.log(`実行件数: ${newItems.length}`);
        console.log(`対象件数: ${items.length}`);

        const tasks = newItems.map(item => {
          const { word, nextTime } = item as GroupWordsItem;

          // 新時間
          const newTime = moment(nextTime)
            .add(diff, 'days')
            .format('YYYYMMDD');

          return updateAsync(updateItem_groupWords(TABLE_GROUP_WORDS, groupId, word, newTime));
        });

        await Promise.all(tasks);
      }
    }
  } finally {
    await updateTable(1);
  }
};

const updateTable = async (newWCU: number) => {
  const client = new DynamoDB();

  let oldWCU = await getWriteCapacityUnits(client, TABLE_GROUP_WORDS);

  // WCU変更なしの場合、処理終了
  if (!oldWCU || oldWCU === -1 || oldWCU === newWCU) {
    return;
  }

  // WCUを変更する
  await client
    .updateTable({
      TableName: TABLE_GROUP_WORDS,
      ProvisionedThroughput: {
        ReadCapacityUnits: 3,
        WriteCapacityUnits: newWCU,
      },
    })
    .promise();

  for (;;) {
    // 2秒待ち
    await sleep(2000);

    oldWCU = await getWriteCapacityUnits(client, TABLE_GROUP_WORDS);

    // WCUが存在しない
    if (!oldWCU || oldWCU === -1) {
      break;
    }

    // 変更成功
    if (oldWCU === newWCU) {
      break;
    }
  }
};

const getWriteCapacityUnits = async (client: DynamoDB, tableName: string) => {
  const result = await client
    .describeTable({
      TableName: tableName,
    })
    .promise();

  // Table存在しない
  if (!result.Table) {
    throw new Error(`Table not found. ${tableName}`);
  }

  // Throughput存在しない
  if (!result.Table.ProvisionedThroughput) {
    return -1;
  }

  return result.Table.ProvisionedThroughput.WriteCapacityUnits;
};
