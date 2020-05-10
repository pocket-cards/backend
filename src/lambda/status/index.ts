import app from './app';

// イベント入口
export const handler = async () => {
  try {
    return await app();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
