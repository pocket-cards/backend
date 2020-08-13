import { Polly, S3 } from 'aws-sdk';
import axios from 'axios';
import * as short from 'short-uuid';
import { DBHelper, ClientUtils, DateUtils, Logger } from '@utils';
import { WordMaster } from '@queries';
import { Environment } from '@consts';

const pronounceKey = Environment.IPA_API_KEY;
const translateKey = Environment.TRANSLATION_API_KEY;

export default async (words: string[]) => {
  // 単語登録用の情報を収集する
  const tasks = words.map((item) => Promise.all([getPronounce(item), saveWithMP3(item), getTranslate(item, 'zh'), getTranslate(item, 'ja')]));

  const result = await Promise.all(tasks);

  Logger.info('単語情報を収集しました.');

  // 単語辞書登録
  const dictTasks = result.map((item) => {
    const pronounce = item[0];
    const mp3 = item[1];
    const vocChn = item[2];
    const vocJpn = item[3];

    return DBHelper().put(
      WordMaster.put({
        id: pronounce['word'],
        pronounce: pronounce['pronounce'],
        mp3,
        vocChn,
        vocJpn,
      })
    );
  });

  // 辞書登録処理
  await Promise.all(dictTasks);

  Logger.info('単語辞書の登録は完了しました.');
};

/** 発音データ取得する */
const getPronounce = async (word: string): Promise<string> => {
  const res = await axios.get(`${Environment.IPA_URL}?word=${word}`, {
    headers: {
      'x-api-key': pronounceKey,
    },
  });

  return res.data;
};

/** 単語のMP3を生成し、S3に保存する */
const saveWithMP3 = async (word: string): Promise<string> => {
  const client = ClientUtils.polly();

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
  const prefix: string = DateUtils.getNow();
  const key: string = `${Environment.PATH_PATTERN}/${prefix}/${filename}`;

  const putRequest: S3.Types.PutObjectRequest = {
    Bucket: Environment.MP3_BUCKET,
    Key: key,
    Body: response.AudioStream,
  };

  const s3Client = ClientUtils.s3();

  // S3に保存する
  await s3Client.putObject(putRequest).promise();

  return key;
};

/** 翻訳 */
const getTranslate = async (word: string, targetLanguageCode: string) => {
  const {
    data: {
      data: { translations },
    },
  } = await axios.post(`${Environment.TRANSLATION_URL}?key=${translateKey}`, {
    q: word,
    from: 'en',
    target: targetLanguageCode,
    format: 'text',
  });

  // 結果ない場合、エラーとする
  if (!translations || translations.length === 0) {
    throw new Error(`翻訳できません。Word:${word}`);
  }

  return translations[0].translatedText;
};
