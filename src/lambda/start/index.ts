import app from './app';

// イベント入口
export const handler = async (event: any) => {
  // イベントログ

  try {
    await app();

    return {
      status: 'STARTED',
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
