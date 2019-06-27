import { CognitoUserPoolTriggerEvent } from 'aws-lambda';
import { updateAsync } from '@utils/dbutils';
import { getNow } from '@utils/utils';
import { updateItem_users } from './db';

// 環境変数
const USERS_TABLE = process.env.USERS_TABLE as string;

export default async (event: CognitoUserPoolTriggerEvent): Promise<void> => {
  if (event.triggerSource !== 'PostAuthentication_Authentication' || !event.userName) {
    return;
  }

  // ユーザ情報更新
  await updateAsync(updateItem_users(USERS_TABLE, event.userName, getNow()));

  console.log(event);
};
