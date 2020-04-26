import { Request } from 'express';
import { C004Params, C004Response } from '@typings/api';
import { DBHelper } from '@utils';
import { Words } from '@src/queries';
import { TWords } from '@typings/tables';

export default async (req: Request): Promise<C004Response> => {
  const params = (req.params as unknown) as C004Params;
  // const request = req.body as C004Request;

  // const result = await DBHelper().put(Words.put({
  //   id: params.word,
  //   groupId: params.word,
  //   nextTime:
  // }));

  // return result.Item as TWords;
  return;
};

// const EmptyResponse = (): C008Response => ({
//   count: 0,
//   words: [],
// });

// const getRandom = (items: DynamoDB.DocumentClient.AttributeMap[], maxItems: number) => {
//   if (maxItems >= items.length) {
//     return items;
//   }

//   const results: DynamoDB.DocumentClient.AttributeMap[] = [];

//   while (results.length != maxItems) {
//     const min = 0;
//     const max = items.length - 1;

//     const random = Math.floor(Math.random() * (max + 1 - min)) + min;

//     results.push(items.splice(random, 1)[0]);
//   }

//   return results;
// };
