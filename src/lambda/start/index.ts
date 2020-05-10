import app from './app';

// イベント入口
export const handler = async (event: any) => {
  // イベントログ

  try {
    app();

    return 'STARTED';
  } catch (error) {
    console.log(error);
    throw error;
  }
};
