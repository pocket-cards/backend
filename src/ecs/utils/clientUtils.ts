import * as XRay from 'aws-xray-sdk';
import * as AWSSDK from 'aws-sdk';
import { DynamoDB, Polly, S3, Translate, SSM, Lambda } from 'aws-sdk';

// export const AWS = process.env.ENVIRONMENT === 'local' ? AWSSDK : XRay.captureAWS(AWSSDK);
const AWS = AWSSDK;

let dynamoDBClient: DynamoDB.DocumentClient;
let pollyClient: Polly;
let s3Client: S3;
let translateClient: Translate;
let ssmClient: SSM;
let lambdaClient: Lambda;

/** Dynamodb Client初期化 */
export const dynamoDB = (options?: DynamoDB.DocumentClient.DocumentClientOptions & DynamoDB.Types.ClientConfiguration): DynamoDB.DocumentClient => {
  // 初期化済
  if (dynamoDBClient) return dynamoDBClient;

  // 初期化パラメータあり
  if (options) return new AWS.DynamoDB.DocumentClient(options);

  // 初期化する
  return new AWS.DynamoDB.DocumentClient({
    region: process.env.DEFAULT_REGION,
  });
};

/** Polly Client初期化 */
export const polly = (options?: Polly.ClientConfiguration): Polly => {
  // 初期化済み
  if (pollyClient) return pollyClient;

  // 初期化設定あり
  if (options) return new AWS.Polly(options);

  return new AWS.Polly({
    region: process.env.DEFAULT_REGION,
  });
};

/** S3 Client初期化 */
export const s3 = (options?: S3.ClientConfiguration): S3 => {
  // 初期化済み
  if (s3Client) return s3Client;

  // 初期化設定あり
  if (options) return new S3(options);

  // 初期化設定なし
  return new AWS.S3({
    region: process.env.DEFAULT_REGION,
    endpoint: process.env.AWS_ENDPOINT,
  });
};

/** Translate初期化 */
export const translate = (options?: Translate.ClientConfiguration): Translate => {
  // 初期化済み
  if (translateClient) return translateClient;

  // 初期化設定あり
  if (options) return new AWS.Translate(options);

  // 初期化設定なし
  return new AWS.Translate({
    region: process.env.DEFAULT_REGION,
  });
};

/** SSM Client初期化 */
export const ssm = (options?: SSM.ClientConfiguration): SSM => {
  // 初期化済み
  if (ssmClient) return ssmClient;

  // 初期化設定あり
  if (options) return new AWS.SSM(options);

  // 初期化設定なし
  return new AWS.SSM({
    region: process.env.DEFAULT_REGION,
  });
};

export const lambda = (options?: Lambda.ClientConfiguration): Lambda => {
  // 初期化済み
  if (lambdaClient) return lambdaClient;

  // 初期化設定あり
  if (options) return new AWS.Lambda(options);

  // 初期化設定なし
  return new AWS.Lambda({
    region: process.env.DEFAULT_REGION,
  });
};
