import { Request } from 'express';
import { DBHelper } from '@utils';
import { WordMaster } from '@queries';
import { E002Params, E002Response, E002Request } from 'typings/api';

export default async (req: Request<E002Params, any, E002Request, any>): Promise<E002Response> => {
  const word = req.params.word;
  const input = req.body;

  const record = await DBHelper().get(WordMaster.get(word));

  // 単語が存在しない場合
  if (!record) {
    throw new Error(`Word not found. {${word}}`);
  }

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
