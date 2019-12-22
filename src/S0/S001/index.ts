import { Logger } from '@utils/utils';

// イベント入口
export const handler = async (event: any) => {
  // イベントログ
  Logger.info(event);

  // try {
  //   // 本処理
  //   const result = await app(event);

  //   // 本処理結果
  //   Logger.info(result);

  //   return;
  // } catch (error) {
  //   // エラーログ
  //   Logger.info(error);

  //   throw error;
  // }
};
