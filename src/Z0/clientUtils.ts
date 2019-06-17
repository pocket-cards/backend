import * as XRay from 'aws-xray-sdk';
import * as AWSSDK from 'aws-sdk';
import { DynamoDB, Polly, S3, Translate, SSM } from 'aws-sdk';

const AWS = XRay.captureAWS(AWSSDK);

/** Dynamodb Client初期化 */
export const dynamoDB = (client: DynamoDB.DocumentClient): DynamoDB.DocumentClient => {
  if (client) return client;

  return new AWS.DynamoDB.DocumentClient({
    region: process.env.DEFAULT_REGION,
  });
};

/** Polly Client初期化 */
export const polly = (client: Polly, options?: Polly.ClientConfiguration): Polly => {
  // 初期化済み
  if (client) return client;

  // 初期化設定あり
  if (options) return new AWS.Polly(options);

  return new AWS.Polly({
    region: process.env.DEFAULT_REGION,
  });
};

/** S3 Client初期化 */
export const s3 = (client: S3, options?: S3.ClientConfiguration): S3 => {
  // 初期化済み
  if (client) return client;

  // 初期化設定あり
  if (options) return new S3(options);

  // 初期化設定なし
  return new AWS.S3({
    region: process.env.DEFAULT_REGION,
  });
};

/** S3 Client初期化 */
export const translate = (client: Translate, options?: Translate.ClientConfiguration): Translate => {
  // 初期化済み
  if (client) return client;

  // 初期化設定あり
  if (options) return new AWS.Translate(options);

  // 初期化設定なし
  return new AWS.Translate({
    region: process.env.DEFAULT_REGION,
  });
};

/** SSM Client初期化 */
export const ssm = (client: SSM, options?: SSM.ClientConfiguration): SSM => {
  // 初期化済み
  if (client) return client;

  // 初期化設定あり
  if (options) return new AWS.SSM(options);

  // 初期化設定なし
  return new AWS.SSM({
    region: process.env.DEFAULT_REGION,
  });
};
