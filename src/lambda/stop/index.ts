import app from './app';

// イベント入口
export const handler = async () => {
  // イベントログ

  try {
    await app();

    return 'STOPPED';
  } catch (error) {
    console.log(error);
    throw error;
  }
};
