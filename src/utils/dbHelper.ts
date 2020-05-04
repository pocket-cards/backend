import { Helper } from 'dynamodb-helper';

let helper: Helper;

export default () => {
  if (helper) return helper;

  helper = new Helper({
    options: {
      region: process.env.AWS_DEFAULT_REGION,
      endpoint: process.env.AWS_ENDPOINT,
      sslEnabled: false,
      xray: false,
    },
    logger: {
      appenders: { console: { type: 'console' } },
      categories: { default: { appenders: ['console'], level: process.env.LOGGER_LEVEL } },
    },
  });

  return helper;
};
