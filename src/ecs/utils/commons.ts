import { Request } from 'express';
import { ssm } from './clientUtils';

// Sleep
export const sleep = (timeout: number) => new Promise((resolve) => setTimeout(() => resolve(), timeout));

/**
 * Header情報からUserIdを取得する(Cognito Authorization IdToken)
 *
 * @param event APIGateway EVENT
 * @param authKey Header Key
 */
export const getUserId = (req: Request, authKey: string = 'authorization') => {
  const value = req.headers[authKey] as string;

  // データが存在しない場合、エラーとする
  if (!value) {
    throw new Error('Can not found User Id.');
  }

  return getUserInfo(value);
};

export const getUserInfo = (base64: string) => {
  try {
    const jwtToken = base64.split('.');
    const userInfo = JSON.parse(Buffer.from(jwtToken[1], 'base64').toString());

    console.log(userInfo);
    return userInfo['cognito:username'];
  } catch (err) {
    // Logger.info(err);
    return null;
  }
};

/** SSM Value */
export const getSSMValue = async (key: string) => {
  const client = ssm();

  const result = await client
    .getParameter({
      Name: key,
      WithDecryption: true,
    })
    .promise();

  if (!result.Parameter || !result.Parameter.Value) {
    throw new Error('Can not get parameters.');
  }

  return result.Parameter.Value;
};
