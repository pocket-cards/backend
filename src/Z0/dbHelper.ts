import { Helper } from 'dynamodb-helper';

let helper: Helper;

export const dbHelper = () => {
  if (helper) return helper;

  helper = new Helper({
    options: {
      region: process.env.AWS_DEFAULT_REGION,
      endpoint: process.env.DYNAMO_ENDPOINT,
      sslEnabled: false
    },
    logger: {
      appenders: { console: { type: 'console' } },
      categories: { default: { appenders: ['console'], level: 'info' } }
    }
  });

  return helper;
};
