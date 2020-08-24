import { Polly, S3 } from 'aws-sdk';
import axios from 'axios';
import * as short from 'short-uuid';
import { ClientUtils, DateUtils } from '@utils';
import { Environment } from '@consts';

const pronounceKey = Environment.IPA_API_KEY;
const translateKey = Environment.TRANSLATION_API_KEY;

/** 発音データ取得する */
export const getPronounce = async (word: string): Promise<string> => {
  const res = await axios.get(`${Environment.IPA_URL}?word=${word}`, {
    headers: {
      'x-api-key': pronounceKey,
    },
  });

  return res.data;
};

/** 単語のMP3を生成し、S3に保存する */
export const saveWithMP3 = async (word: string): Promise<string> => {
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
export const getTranslate = async (word: string, targetLanguageCode: string) => {
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
