import { M001Event } from '.';
import { ssm } from '@utils/clientUtils';
import axios from 'axios';
import { Logger } from '@utils/utils';

const SLACK_URL_KEY = process.env.SLACK_URL_KEY as string;

export default async (event: M001Event): Promise<void> => {
  // 初期化
  const client = ssm();

  const result = await client
    .getParameter({
      Name: SLACK_URL_KEY,
      WithDecryption: true
    })
    .promise();

  if (!result.Parameter || !result.Parameter.Value) {
    throw new Error('Can not get parameters.');
  }

  const slackUrl = result.Parameter.Value;

  Logger.info(slackUrl);
  // Slackにメッセージに送信する
  await axios.post(slackUrl, {
    text: event.message
  });
};
