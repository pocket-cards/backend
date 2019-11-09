import moment from 'moment';
import { APIGatewayEvent } from 'aws-lambda';
import { Helper } from 'dynamodb-helper';

export const getNow = () => `${moment().format('YYYYMMDD')}`;

const days = [1, 2, 4, 7, 15, 30, 60, 90];

/** 次回学習時間を計算する */
export const getNextTime = (times: number) => {
  if (times === 0) return getNow();

  const addValue = days[times - 1];

  const nextTime = moment()
    .add(addValue, 'days')
    .format('YYYYMMDD');

  return `${nextTime}`;
};

// Sleep
export const sleep = (timeout: number) => new Promise(resolve => setTimeout(() => resolve(), timeout));

/**
 * Header情報からUserIdを取得する(Cognito Authorization IdToken)
 *
 * @param event APIGateway EVENT
 * @param authKey Header Key
 */
export const getUserId = (event: APIGatewayEvent, authKey: string = 'Authorization') => {
  const value = event.headers[authKey];

  // データが存在しない場合、エラーとする
  if (!value) {
    throw new Error('Can not found User Id.');
  }

  try {
    // {
    //   sub: 'cbff371c-ef97-4afc-b6a3-166c2163307e',
    //   aud: 'relm874c6hkjouqalvvq0utth',
    //   email_verified: true,
    //   token_use: 'id',
    //   auth_time: 1570971688,
    //   iss: 'https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_Pn4pwBiY0',
    //   'cognito:username': 'wwalpha',
    //   exp: 1570975288,
    //   iat: 1570971688,
    //   email: 'wwalpha@gmail.com'
    // }
    // const userJson = Buffer.from(value, 'base64').toString();
    // const userInfo = JSON.parse(userJson);
    // return userInfo['cognito:username'];
    return 'wwalpha';
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getResponse = (statusCode: number, body?: string) => ({
  statusCode,
  isBase64Encoded: false,
  headers: {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body,
});

let helper: Helper;

export const dbHelper = () => {
  if (helper) return helper;

  helper = new Helper({
    options: {
      region: process.env.AWS_DEFAULT_REGION,
      endpoint: process.env.DYNAMO_ENDPOINT,
      sslEnabled: false,
    },
    logger: {
      appenders: { console: { type: 'console' } },
      categories: { default: { appenders: ['console'], level: 'info' } },
    },
  });

  return helper;
};
