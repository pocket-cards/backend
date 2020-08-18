import { Request } from 'express';
import { Logger } from '@utils';
import { C001Request } from 'typings/api';
import registWords from './lib/registWords';
import checkDictExists from './lib/checkDictExists';
import registDictionary from './lib/registDictionary';

export default async (req: Request<any, any, C001Request, any>): Promise<void> => {
  const input = req.body;
  const groupId = req.params['groupId'];
  const words = input.words.map((item) => item.toLowerCase());

  // Wordsのデータ登録
  await registWords(groupId, words);

  Logger.info('単語登録完了しました.');

  const targets = await checkDictExists(words);

  Logger.info('対象数:', targets.length);

  // すでに辞書に存在しました
  if (targets.length === 0) {
    return;
  }

  // 辞書の登録
  await registDictionary(targets);
};
