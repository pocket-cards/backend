import { Request } from 'express';
import { DBHelper } from '@utils';
import { WordMaster } from '@queries';
import { E002Params, E002Response, E002Request } from 'typings/api';
import { getPronounce, saveWithMP3, getTranslate } from './lib';
import { TWordMaster } from 'typings/tables';

export default async (req: Request<E002Params, any, E002Request, any>): Promise<E002Response> => {
  const word = req.params.word;
  const input = req.body;

  const record = await DBHelper().get(WordMaster.get(word));

  // 単語が存在しない場合
  if (!record) {
    // 新規追加
    await addNew(word);

    return;
  }

  // 既存更新
  await update(word, input);
};

const addNew = async (word: string) => {
  // 新規単語追加
  const results = await Promise.all([getPronounce(word), saveWithMP3(word), getTranslate(word, 'zh'), getTranslate(word, 'ja')]);

  const item: TWordMaster = {
    id: word,
    pronounce: results[0]['pronounce'],
    mp3: results[1],
    vocChn: results[2],
    vocJpn: results[3],
  };

  // DB 更新
  await DBHelper().put(WordMaster.put(item));
};

const update = async (word: string, input: E002Request) => {
  // 単語詳細情報を取得する
  await DBHelper().put(
    WordMaster.put({
      id: word,
      mp3: input.mp3,
      pronounce: input.pronounce,
      vocChn: input.vocChn,
      vocJpn: input.vocJpn,
    })
  );
};
