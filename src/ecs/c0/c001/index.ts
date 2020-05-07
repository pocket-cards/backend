import { Request } from 'express';
import { Logger } from 'src/ecs/utils';
import { C001Request } from '@typings/api';
import registWords from './lib/registWords';
import checkDictExists from './lib/checkDictExists';
import registDictionary from './lib/registDictionary';

export default async (req: Request): Promise<void> => {
  const input = req.body as C001Request;
  const groupId = req.params['groupId'];

  // Wordsのデータ登録
  await registWords(groupId, input.words);

  Logger.info('単語登録完了しました.');

  const targets = await checkDictExists(input.words);

  Logger.info('対象数:', targets.length);

  // すでに辞書に存在しました
  if (targets.length === 0) {
    return;
  }

  // 辞書の登録
  await registDictionary(targets);
};
