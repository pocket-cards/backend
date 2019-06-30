import { CognitoUserPoolTriggerEvent } from 'aws-lambda';
import { updateAsync, putAsync } from '@utils/dbutils';
import { getNow } from '@utils/utils';
import { lambda } from '@utils/clientUtils';
import { updateItem_users, putItem_users } from './db';

// 環境変数
const TABLE_USERS = process.env.TABLE_USERS as string;
const FUNCTION_NAME = process.env.FUNCTION_NAME as string;
const FUNCTION_QUALIFIER = process.env.FUNCTION_QUALIFIER as string;

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

  await updateAsync(updateItem_users(TABLE_USERS, event.userName, getNow()));

  await lambda().invoke({
    FunctionName: FUNCTION_NAME,
    InvocationType: 'Event',
    Payload: JSON.stringify(event),
    Qualifier: FUNCTION_QUALIFIER,
  });
};

const postPostConfirmation = async (event: CognitoUserPoolTriggerEvent) => {
  if (!event.userName) return;

  console.log('postPostConfirmation');
  await putAsync(
    putItem_users(TABLE_USERS, {
      id: event.userName,
      email: event.request.userAttributes['email'] as string,
      login: getNow(),
      lastLogin: getNow(),
    })
  );
};
