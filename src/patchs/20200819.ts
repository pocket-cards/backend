import { DBHelper } from '../ecs/utils';
import { Words } from '../ecs/queries';
import { Environment } from '../ecs/consts';
import { TWords, TWordMaster } from 'typings/tables';

const start = async () => {
  const master = (
    await DBHelper().scan({
      TableName: Environment.TABLE_WORD_MASTER,
    })
  ).Items as TWordMaster[];

  const words = (
    await DBHelper().scan({
      TableName: Environment.TABLE_WORDS,
    })
  ).Items as TWords[];

  const tasks = words
    .map(
      (item) =>
        ({
          ...item,
          vocabulary: master.find((m) => m.id === item.id)?.vocJpn,
        } as TWords)
    )
    .map((item) => DBHelper().put(Words.put(item)));

  await Promise.all(tasks);
};

start();
