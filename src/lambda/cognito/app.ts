import { DynamoDB } from 'aws-sdk';
import { CognitoUserPoolTriggerEvent } from 'aws-lambda';
import { TUsers } from 'typings/tables';

const db = new DynamoDB.DocumentClient();

export default async (e: CognitoUserPoolTriggerEvent) => {
  if (e.triggerSource === 'PostAuthentication_Authentication') {
    // 行動履歴取得
    await createUser(e);

    return e;
  }

  return e;
};

const createUser = async (e: CognitoUserPoolTriggerEvent) => {
  const item: TUsers = {
    id: e.userName,
    email: e.request.userAttributes['email'],
    name: e.request.userAttributes['name'],
    icon: e.request.userAttributes['picture'],
  };

  // ユーザ登録
  try {
    await db.put(put(item)).promise();
  } catch (e) {
    // 条件チェックエラーの場合、無視する
    if (e.code === 'ConditionalCheckFailedException') {
      return;
    }

    throw e;
  }
};

/** データ更新 */
const put = (item: TUsers) =>
  ({
    TableName: process.env.TABLE_USERS as string,
    Item: item,
    ConditionExpression: 'attribute_not_exists(id)',
  } as DynamoDB.DocumentClient.PutItemInput);
