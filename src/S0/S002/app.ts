import { CognitoUserPoolTriggerEvent } from 'aws-lambda';
import { updateAsync, putAsync } from '@utils/dbutils';
import { getNow } from '@utils/utils';
import { updateItem_users, putItem_users } from './db';

// 環境変数
const USERS_TABLE = process.env.USERS_TABLE as string;

export default async (event: CognitoUserPoolTriggerEvent): Promise<void> => {
  switch (event.triggerSource) {
    case 'PostAuthentication_Authentication':
      await postAuthentication(event);
      break;
    case 'PostConfirmation_ConfirmSignUp':
      await postPostConfirmation(event);
      break;
  }
};

const postAuthentication = async (event: CognitoUserPoolTriggerEvent) => {
  console.log('postAuthentication');

  if (!event.userName) return;

  await updateAsync(updateItem_users(USERS_TABLE, event.userName, getNow()));
};

const postPostConfirmation = async (event: CognitoUserPoolTriggerEvent) => {
  if (!event.userName) return;

  console.log('postPostConfirmation');
  await putAsync(
    putItem_users(USERS_TABLE, {
      id: event.userName,
      email: event.request.userAttributes['email'] as string,
      login: getNow(),
      lastLogin: getNow(),
    })
  );
};
