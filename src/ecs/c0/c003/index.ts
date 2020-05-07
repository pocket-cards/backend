import { Request } from 'express';
import { C003Response, C003Params } from '@typings/api';
import { DBHelper } from 'src/ecs/utils';
import { Words } from 'src/ecs/queries';
import { TWords } from '@typings/tables';

export default async (req: Request): Promise<C003Response> => {
  const params = (req.params as unknown) as C003Params;

  const result = await DBHelper().get(Words.get({ id: params.word, groupId: params.groupId }));

  return result.Item as TWords;
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
