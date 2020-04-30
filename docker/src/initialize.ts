import * as AWS from 'aws-sdk';
import * as path from 'path';

require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env.credentials') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

AWS.config.update({
  region: process.env.DEFAULT_REGION,
});

/** SSM初期化 */
const registSSM = async () => {
  const get = new AWS.SSM({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const ipa = (
    await get
      .getParameter({
        Name: process.env.IPA_API_KEY as string,
      })
      .promise()
  ).Parameter?.Value;

  const translate = (
    await get
      .getParameter({
        Name: process.env.TRANSLATION_API_KEY as string,
      })
      .promise()
  ).Parameter?.Value;

  if (!ipa || !translate) return;

  const set = new AWS.SSM({
    endpoint: process.env.AWS_ENDPOINT,
  });

  await set
    .putParameter({
      Name: process.env.IPA_API_KEY as string,
      Value: ipa,
      Type: 'SecureString',
    })
    .promise();

  await set
    .putParameter({
      Name: process.env.TRANSLATION_API_KEY as string,
      Value: translate,
      Type: 'SecureString',
    })
    .promise();
};

/** S3初期化 */
const initS3 = async () => {
  const s3 = new AWS.S3({
    endpoint: process.env.AWS_ENDPOINT,
  });

  await s3
    .createBucket({
      Bucket: process.env.MP3_BUCKET as string,
    })
    .promise();

  console.log(await s3.listBuckets().promise());
};

(async () => {
  console.log('regist ssm...');
  // await registSSM();

  console.log('initialize s3...');
  // await initS3();

  console.log(process.env);
})();
