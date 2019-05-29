import { DynamoDB, AWSError, Polly, S3 } from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import { ResponseBody, RequestBody } from './index';
import { dynamoDB, polly } from '@utils/clientUtils';
import { putItem_groups, gutItem_words, putItem_words } from './db';
import { axiosGet } from '@utils/utils';

let client: DynamoDB.DocumentClient;
let pollyClient: Polly;
let s3Client: S3;

// 環境変数
const WORDS_TABLE = process.env.WORDS_TABLE as string;
const GROUPS_TABLE = process.env.GROUPS_TABLE as string;
const IPA_URL = process.env.IPA_URL as string;
const IPA_API_KEY = process.env.IPA_API_KEY as string;

export default async (event: APIGatewayEvent): Promise<ResponseBody> => {
  if (!event.body || !event.pathParameters) {
    return (undefined as unknown) as ResponseBody;
  }

  const input = JSON.parse(event.body) as RequestBody;
  const groupId = event.pathParameters['groupId'];

  // DynamoDB Client 初期化
  client = dynamoDB(client);

  // グループ単語登録用タスクを作成する
  let tasks = input.words.map(item => client.put(putItem_groups(GROUPS_TABLE, groupId, item)).promise());

  try {
    // グループ単語登録
    await Promise.all(tasks);
  } catch (err) {
    // キー既存あり以外の場合、エラーとする
    if ((err as AWSError).code !== 'ConditionalCheckFailedException') {
      throw err;
    }
  }

  tasks = input.words.map(
    item =>
      new Promise(async resolve => {
        const wordInfo = await client.get(gutItem_words(WORDS_TABLE, item)).promise();

        if (wordInfo.Item) {
          return resolve();
        }

        const result = await axiosGet(IPA_URL, {
          headers: {
            'x-api-key': IPA_API_KEY,
          },
        });

        return client
          .put(
            putItem_words(WORDS_TABLE, {
              word: item,
              pronounce: result.data,
            })
          )
          .promise();
      })
  );

  // 重複結果を削除してから返却する
  return {};
};

const getPronounce = () =>
  axiosGet(IPA_URL, {
    headers: {
      'x-api-key': IPA_API_KEY,
    },
  });

const getMP3 = () => {
  const client = polly(pollyClient);

  /**  */
  const request: Polly.SynthesizeSpeechInput = {
    Text: '',
    TextType: 'ssml',
    VoiceId: 'Joanna',
    OutputFormat: 'mp3',
    LanguageCode: 'en-US',
  };
};
