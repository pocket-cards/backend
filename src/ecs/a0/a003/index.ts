import { DynamoDB } from 'aws-sdk';
import moment from 'moment';
import { Request } from 'express';
import { TUsers, TGroups, TWords } from 'typings/tables';
import { DateUtils, DBHelper, Commons, Logger } from '@utils';
import { Users, Words } from '@queries';
import { Environment } from '@consts';

export default async (req: Request): Promise<void> => {
  //const { userName } = req;
  const userId = 'wwalpha';

  if (!userId) throw new Error('UserNameが存在しません。');

  // ユーザ情報検索
  const userInfo = await DBHelper().get(Users.get(userId));

  // ユーザ情報が存在しない
  if (!userInfo.Item) return;

  const { studyQuery, id } = userInfo.Item as TUsers;

  // すでに当日の場合、そのまま終了する
  if (studyQuery === DateUtils.getNow()) {
    return;
  }

  const userGroupsInfo = null; //await DBHelper().query(Users.query.byUserId(id));

  // ユーザグループ情報が存在しない
  if (!userGroupsInfo.Items || userGroupsInfo.Count === 0) return;

  let maxDate = '00000000';

  for (let idx in userGroupsInfo.Items) {
    const { id } = userGroupsInfo.Items[idx] as TGroups;

    // 最後の学習日を取得する
    const groupInfo = await DBHelper().query(Words.query.lastStudyDate(id));

    // データが存在しない
    if (!groupInfo.Items || groupInfo.Count === 0) {
      continue;
    }

    const { lastTime } = groupInfo.Items[0] as TWords;

    // 最大日付を計算する
    if (lastTime) {
      maxDate = Number(maxDate) >= Number(lastTime) ? maxDate : lastTime;
    }
  }

  // 差異日数を計算する
  const diff = moment(DateUtils.getNow(), 'YYYYMMDD').diff(moment(maxDate, 'YYYYMMDD'), 'days') - 1;

  Logger.info(`差異日数: ${diff}`);

  // スキップの日数がない
  if (diff === 0) {
    return;
  }

  // ユーザ情報を更新する
  await DBHelper().update(Users.update.userInfo(userId, DateUtils.getNow()));

  try {
    await updateTable(100);

    for (let idx in userGroupsInfo.Items) {
      const { id } = userGroupsInfo.Items[idx] as TGroups;

      // 学習履歴ある単語を全部取得する
      const groupInfo = await DBHelper().query(Words.query.lastStudyDate(id));

      Logger.info(`対象件数: ${groupInfo.Count}`);

      // データが存在しない
      if (groupInfo.Count === 0 || !groupInfo.Items) {
        continue;
      }

      const items = groupInfo.Items;

      for (let count = 0; items.length > count; ) {
        const newItems = items.splice(0, 50);
        Logger.info(`実行件数: ${newItems.length}`);
        Logger.info(`対象件数: ${items.length}`);

        const tasks = newItems.map((item) => {
          const { id: word, nextTime } = item as TWords;

          // 新時間
          const newTime = moment(nextTime).add(diff, 'days').format('YYYYMMDD');

          return DBHelper().update(Words.update.nextTime(word, id, newTime));
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

  let oldWCU = await getWriteCapacityUnits(client, Environment.TABLE_WORDS);

  // WCU変更なしの場合、処理終了
  if (!oldWCU || oldWCU === -1 || oldWCU === newWCU) {
    return;
  }

  // WCUを変更する
  await client
    .updateTable({
      TableName: Environment.TABLE_WORDS,
      ProvisionedThroughput: {
        ReadCapacityUnits: 3,
        WriteCapacityUnits: newWCU,
      },
    })
    .promise();

  for (;;) {
    // 2秒待ち
    await Commons.sleep(2000);

    oldWCU = await getWriteCapacityUnits(client, Environment.TABLE_WORDS);

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
