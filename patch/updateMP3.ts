import { Polly, S3, DynamoDB } from 'aws-sdk';
import * as short from 'short-uuid';
import * as moment from 'moment';

const PATH_PATTERN = 'audio';
const MP3_BUCKET = 'pocket-cards-mp3';
const REGION = 'ap-northeast-1';

const start = async () => {
  const client = new DynamoDB.DocumentClient({
    region: REGION,
  });

  const results = await client
    .scan({
      TableName: 'PocketCards_Words',
      ProjectionExpression: 'word',
    })
    .promise();

  if (!results.Items) {
    return;
  }

  console.log(results.Items, results.Count, short.generate());
  for (const idx in results.Items) {
    const item = results.Items[idx];
    const word = item.word;

    console.log(word);
    const key = await getMP3(word);

    await client
      .update({
        TableName: 'PocketCards_Words',
        Key: {
          word,
        },
        UpdateExpression: 'set #mp3 = :mp3',
        ExpressionAttributeNames: {
          '#mp3': 'mp3',
        },
        ExpressionAttributeValues: {
          ':mp3': key,
        },
      })
      .promise();
  }
};

const getMP3 = async (word: string): Promise<string> => {
  const client = new Polly({
    region: REGION,
  });

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

  const sClient = new S3({
    region: REGION,
  });
  // S3に保存する
  await sClient.putObject(putRequest).promise();

  return key;
};

start();
