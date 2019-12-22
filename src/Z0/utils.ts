import { APIGatewayEvent } from 'aws-lambda';
import Log4js from 'log4js';

export const Logger = Log4js.getLogger();

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
    Logger.info(err);
    return null;
  }
};

export const getResponse = (statusCode: number, body?: string) => ({
  statusCode,
  isBase64Encoded: false,
  headers: {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body
});
