import { APIGatewayEvent } from 'aws-lambda';
import { RequestBody } from './index';

export default (event: APIGatewayEvent) =>
  new Promise((resolve, reject) => {
    if (!event.body) {
      reject('No body data exists');
      return;
    }

    const input = JSON.parse(event.body) as RequestBody;

    // 対象単語なし
    if (input.words.length === 0) {
      reject('登録対象単語が存在しません');
      return;
    }

    const filter = input.words.filter(item => item.length !== 0);

    // 対象単語なし
    if (filter.length === 0) {
      reject('登録対象単語が存在しません');
      return;
    }

    // 空白の単語が存在します
    if (filter.length !== input.words.length) {
      reject('空白文字が存在します');
      return;
    }

    resolve();
  });
