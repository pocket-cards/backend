import { DynamoDB, Polly, S3 } from 'aws-sdk';

/** Dynamodb Client初期化 */
export const dynamoDB = (client: DynamoDB.DocumentClient): DynamoDB.DocumentClient => {
  if (client) return client;

  return new DynamoDB.DocumentClient({
    region: process.env.DEFAULT_REGION,
  });
};

/** Polly Client初期化 */
export const polly = (client: Polly, options?: Polly.ClientConfiguration): Polly => {
  // 初期化済み
  if (client) return client;

  // 初期化設定あり
  if (options) return new Polly(options);

  return new Polly({
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
  return new S3({
    region: process.env.DEFAULT_REGION,
  });
};
