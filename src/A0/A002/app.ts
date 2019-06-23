import { APIGatewayEvent } from 'aws-lambda';
import { HistoryItem } from '@typings/tables';
import { queryAsync } from '@utils/dbutils';
import moment = require('moment');
import { queryItem_history } from './db';
import { A002Response } from '@typings/api';
import * as _ from 'lodash';

// 環境変数
const HISTORY_TABLE = process.env.HISTORY_TABLE as string;
const TIMESTAMP_ENDFIX = '000000000';

export default async (event: APIGatewayEvent): Promise<A002Response> => {
  if (!event.pathParameters) {
    return EmptyResponse();
  }

  const userId = event.pathParameters['userId'];
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

  const results = await queryAsync(queryItem_history(HISTORY_TABLE, userId, `${day3}`));

  const items = (results.Items as unknown) as HistoryItem[];
  // 検索結果なし
  if (results.Count === 0 || !items) {
    return EmptyResponse();
  }

  const daily = items.filter(item => item.timestamp >= day1);
  const dailyReview = daily.filter(item => item.times === 1 && item.lastTime);
  const dailyNew = daily.filter(item => item.times === 1 && !item.lastTime);
  const weekly = items.filter(item => item.timestamp >= day2).length;
  const monthly = items.filter(item => item.timestamp >= day3).length;

  return {
    daily: {
      total: daily.length,
      new: dailyNew.length,
      review: dailyReview.length,
    },
    weekly,
    monthly,
  };
};

const EmptyResponse = (): A002Response => ({
  daily: {
    new: 0,
    review: 0,
    total: 0,
  },
  monthly: 0,
  weekly: 0,
});
