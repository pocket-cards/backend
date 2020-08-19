import { Request } from 'express';
import { DBHelper } from '@utils';
import registWords from './lib/registWords';
import registDictionary from './lib/registDictionary';
import { WordMaster } from '@queries';
import { TWordMaster } from 'typings/tables';
import { C001Request } from 'typings/api';

export default async (req: Request<any, any, C001Request, any>): Promise<void> => {
  const input = req.body;
  const groupId = req.params['groupId'];
  const words = input.words.map((item) => item.toLowerCase());

  // 既存単語マスタを検索する
  const tasks = words.map((item) => DBHelper().get(WordMaster.get(item)));
  const dict = (await Promise.all(tasks)).filter((item) => item).map((item) => item.Item as TWordMaster);

  // 新規追加の単語
  const news = words.filter((item) => !dict.find((r) => r.id === item));
  // 辞書に追加する
  const newDict = await registDictionary(news);

  // Wordsのデータ登録
  await registWords(groupId, words, [...dict, ...newDict]);
};
