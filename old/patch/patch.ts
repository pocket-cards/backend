import { DynamoDB, Polly, S3, Translate } from 'aws-sdk';
import moment = require('moment');
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as short from 'short-uuid';

let pollyClient: Polly;
let s3Client: S3;
let translateClient: Translate;

const PATH_PATTERN = 'audio';
const TABLE_WORD_MASTER = 'PocketCards_Words';
const IPA_URL = 'https://m1rb1oo72l.execute-api.ap-northeast-1.amazonaws.com/v1';
const IPA_API_KEY = process.env.TF_VAR_ipa_api_key;
const MP3_BUCKET = 'pocket-cards-mp3';

export const queryItem_groups = (table: string, groupId: string) =>
  ({
    TableName: table,
    ProjectionExpression: 'word',
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': groupId,
    },
  } as DynamoDB.DocumentClient.QueryInput);

export const scanItem_words = (table: string) =>
  ({
    TableName: table,
    ProjectionExpression: 'word',
  } as DynamoDB.DocumentClient.ScanInput);

const patch = async () => {
  const client = new DynamoDB.DocumentClient({
    region: 'ap-northeast-1',
  });

  const queryResult = await client.query(queryItem_groups('PocketCards_GroupWords', 'x001')).promise();
  const scanResult = await client.scan(scanItem_words(TABLE_WORD_MASTER)).promise();

  const groupItems = queryResult.Items;
  const wordItems = scanResult.Items;

  if (!wordItems || !groupItems) {
    return;
  }

  const results = groupItems
    .filter((item) => wordItems.find((subItem) => subItem.word === item.word) === undefined)
    .map((item) => item.word);

  console.log(results.length);

  while (results.length > 0) {
    const targets = results.length > 50 ? results.slice(0, 50) : results;

    const taskArray = targets.map((item) =>
      Promise.all([getPronounce(item), getMP3(item), getTranslate(item, 'zh'), getTranslate(item, 'ja')])
    );

    const result = await Promise.all(taskArray);

    console.log('単語情報を収集しました.');

    // 単語辞書登録
    const putTasks = result.map((item) => {
      const pronounce = item[0];
      const mp3 = item[1];
      const vocChn = item[2];
      const vocJpn = item[3];

      return client
        .put(
          putItem_words(TABLE_WORD_MASTER, {
            word: pronounce['word'],
            pronounce: pronounce['pronounce'],
            mp3,
            vocChn,
            vocJpn,
          })
        )
        .promise();
    });

    // 辞書登録処理
    await Promise.all(putTasks);
  }
};

export const putItem_words = (tableName: string, word: any) =>
  ({
    TableName: tableName,
    Item: word,
  } as DynamoDB.DocumentClient.PutItemInput);

export const axiosGet = (url: string, config?: AxiosRequestConfig) =>
  new Promise<AxiosResponse<any>>((resolve, reject) => {
    axios
      .get(url, config)
      .then((value) => resolve(value))
      .catch((err) => reject(err));
  });

export const axiosPost = (url: string, config?: AxiosRequestConfig) =>
  new Promise<AxiosResponse<any>>((resolve, reject) => {
    axios
      .post(url, config)
      .then((value) => resolve(value))
      .catch((err) => reject(err));
  });

const getPronounce = async (word: string) => {
  const res = await axiosGet(`${IPA_URL}?word=${word}`, {
    headers: {
      'x-api-key': IPA_API_KEY,
    },
  });

  return res.data;
};

const getMP3 = async (word: string): Promise<string> => {
  const client = polly(pollyClient);

  /**  */
  const request: Polly.SynthesizeSpeechInput = {
    Text: word,
    TextType: 'text',
    VoiceId: 'Joanna',
    OutputFormat: 'mp3',
    LanguageCode: 'en-US',
  };

  const response = await client.synthesizeSpeech(request).promise();

  // ファイル名
  const filename: string = `${short.generate()}.mp3`;
  const prefix: string = `${moment().format('YYYYMMDD')}`;
  const key: string = `${PATH_PATTERN}/${prefix}/${filename}`;

  const putRequest: S3.Types.PutObjectRequest = {
    Bucket: MP3_BUCKET,
    Key: key,
    Body: response.AudioStream,
  };

  const sClient = s3(s3Client);
  // S3に保存する
  await sClient.putObject(putRequest).promise();

  return key;
};

const getTranslate = async (word: string, targetLanguageCode: string): Promise<string> => {
  const client = translate(translateClient);

  const request: Translate.TranslateTextRequest = {
    SourceLanguageCode: 'en',
    TargetLanguageCode: targetLanguageCode,
    Text: word,
  };

  const response = await client.translateText(request).promise();

  return response.TranslatedText;
};

/** Dynamodb Client初期化 */
export const dynamoDB = (client: DynamoDB.DocumentClient): DynamoDB.DocumentClient => {
  if (client) return client;

  return new DynamoDB.DocumentClient({
    region: 'ap-northeast-1',
  });
};

/** Polly Client初期化 */
export const polly = (client: Polly, options?: Polly.ClientConfiguration): Polly => {
  // 初期化済み
  if (client) return client;

  // 初期化設定あり
  if (options) return new Polly(options);

  return new Polly({
    region: 'ap-northeast-1',
  });
};

/** S3 Client初期化 */
export const s3 = (client: S3, options?: S3.ClientConfiguration): S3 => {
  // 初期化済み
  if (client) return client;

  // 初期化設定あり
  if (options) return new S3(options);

  // 初期化設定なし
  return new S3({
    region: 'ap-northeast-1',
  });
};

/** S3 Client初期化 */
export const translate = (client: Translate, options?: Translate.ClientConfiguration): Translate => {
  // 初期化済み
  if (client) return client;

  // 初期化設定あり
  if (options) return new Translate(options);

  // 初期化設定なし
  return new Translate({
    region: 'ap-northeast-1',
  });
};

patch();
