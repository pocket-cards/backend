import { DynamoDB, AWSError } from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import * as moment from 'moment';
import { ResponseBody, RequestBody } from './index';
import { dynamoDB } from '../../Z0/clientUtils';
import { Words_Item } from '../../../typings/types';

let client: DynamoDB.DocumentClient;

// 環境変数
const WORDS_TABLE = process.env.WORDS_TABLE as string;
const GROUPS_TABLE = process.env.GROUPS_TABLE as string;

export const app = async (event: APIGatewayEvent): Promise<ResponseBody> => {
  if (!event.body || !event.pathParameters) {
    return (undefined as unknown) as ResponseBody;
  }

  const input = JSON.parse(event.body) as RequestBody;
  const groupId = event.pathParameters['groupId'];

  // DynamoDB Client 初期化
  client = dynamoDB(client);

  // 登録用準備
  input.words.forEach(async item => {
    // 必須チェック
    if (!item || item.length === 0) return;

    // 登録Request作成
    try {
      const result = await client.put(putItem_words(item)).promise();

      console.log(result);
    } catch (err) {
      // キー既存ありのでは場合、エラーとする
      if ((err as AWSError).code !== 'ConditionalCheckFailedException') {
        throw err;
      }
    }

    console.log(putItem_groups(groupId, item));
    // グループに追加する
    const r = await client.put(putItem_groups(groupId, item)).promise();
    console.log(r);
  });

  // 重複結果を削除してから返却する
  return {};
};

/** Words Tableデータ登録 */
const putItem_words = (word: string) =>
  ({
    TableName: WORDS_TABLE,
    Item: {
      word
    } as Words_Item,
    ConditionExpression: 'attribute_not_exists(word)'
  } as DynamoDB.DocumentClient.PutItemInput);

/** Group Tableデータ登録 */
const putItem_groups = (groupId: string, word: string) =>
  ({
    TableName: GROUPS_TABLE,
    Item: {
      id: groupId,
      last_time: moment().format('YYYYMMDDHHmmssSSS'),
      word
    }
  } as DynamoDB.DocumentClient.PutItemInput);
