import { APIGatewayEvent } from 'aws-lambda';
import { B002Response } from '@typings/api';
import { getUserId } from '@utils/utils';
import * as DBUtils from '@utils/dbutils';
import { query } from './db';
import { UserGroupsItem } from '@typings/tables';

export default async (event: APIGatewayEvent): Promise<B002Response> => {
  const userId = getUserId(event);

  const results = await DBUtils.queryAsync(query(userId));

  // ０件
  if (results.Count === 0 || results.Items) return [];

  const items = results.Items as UserGroupsItem[];

  return [];
};
