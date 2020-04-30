import * as AWS from 'aws-sdk';
import * as path from 'path';

require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

AWS.config.update({
  region: process.env.DEFAULT_REGION,
});

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
  console.log('initialize s3...');
  await initS3();
})();
