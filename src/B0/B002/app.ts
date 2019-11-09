import { APIGatewayEvent } from 'aws-lambda';
import { getUserId, dbHelper } from '@utils/utils';
import { queryInput } from './db';
import { B002Response } from '@typings/api';

export default async (event: APIGatewayEvent): Promise<B002Response> => {
  const userId = getUserId(event);

  // 検索
  const results = await dbHelper().query(queryInput(userId));

  console.log(results);
  // ０件
  if (results.Count === 0 || !results.Items) return [];

  return results.Items as B002Response;
};
