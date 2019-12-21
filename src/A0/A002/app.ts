import { APIGatewayEvent } from 'aws-lambda';
import moment from 'moment';
import { A002Response } from '@typings/api';
import { getNow, getUserId } from '@utils/utils';
import { queryItem_history, queryItem_userGroups, queryItem_groups_test, queryItem_groups_review } from './db';
import * as _ from 'lodash';
import { UserGroups, History } from '@typings/tables';
import { dbHelper } from '@utils/dbHelper';

// 環境変数
const TABLE_HISTORY = process.env.TABLE_HISTORY as string;
const TABLE_USER_GROUPS = process.env.TABLE_USER_GROUPS as string;
const TABLE_GROUP_WORDS = process.env.TABLE_GROUP_WORDS as string;

const TIMESTAMP_ENDFIX = '000000000';

export default async (event: APIGatewayEvent): Promise<A002Response> => {
  if (!event.pathParameters) {
    return EmptyResponse();
  }

  const userId = getUserId(event);
  // 日次
  const day1 = `${moment().format('YYYYMMDD')}${TIMESTAMP_ENDFIX}`;
  // 週次
  const day2 = `${moment()
    .add(-1, 'weeks')
    .format('YYYYMMDD')}${TIMESTAMP_ENDFIX}`;
  // 月次
  const day3 = `${moment()
    .add(-1, 'months')
    .format('YYYYMMDD')}${TIMESTAMP_ENDFIX}`;

  const results = await dbHelper().query(queryItem_history(TABLE_HISTORY, userId, `${day3}`));

  const items = (results.Items as unknown) as History[];
  // 検索結果なし
  if (results.Count === 0 || !items) {
    return EmptyResponse();
  }

  const daily = items.filter(item => item.timestamp >= day1);
  const dailyReview = daily.filter(item => item.times === 1 && item.lastTime);
  const dailyNew = daily.filter(item => item.times === 1 && !item.lastTime);
  const weekly = items.filter(item => item.timestamp >= day2).length;
  const monthly = items.filter(item => item.timestamp >= day3).length;

  const remaining = await queryRemaining(userId);

  return {
    remaining,
    daily: {
      total: daily.length,
      new: dailyNew.length,
      review: dailyReview.length
    },
    weekly,
    monthly
  };
};

/** 残単語数を計算する */
const queryRemaining = async (userId: string) => {
  let test = 0;
  let review = 0;

  // ユーザのグループ一覧を取得する
  const userInfo = await dbHelper().query(queryItem_userGroups(TABLE_USER_GROUPS, userId));

  // 検索失敗
  if (!userInfo.Items) {
    return { test, review };
  }

  // グループごと検索する
  for (let idx = 0; idx < userInfo.Items.length; idx = idx + 1) {
    const groupId = (userInfo.Items[idx] as UserGroups).groupId;

    // 件数検索
    let result = await dbHelper().query(queryItem_groups_test(TABLE_GROUP_WORDS, groupId, getNow()));

    // 検索成功の場合
    if (result.Count) {
      // 件数を統計する
      test = test + result.Count;
    }

    // 件数検索
    result = await dbHelper().query(queryItem_groups_review(TABLE_GROUP_WORDS, groupId, getNow()));

    // 検索成功の場合
    if (result.Count) {
      // 件数を統計する
      review = review + result.Count;
    }
  }

  return {
    test,
    review
  };
};

const EmptyResponse = (): A002Response => ({
  remaining: {
    review: 0,
    test: 0
  },
  daily: {
    new: 0,
    review: 0,
    total: 0
  },
  monthly: 0,
  weekly: 0
});
