import * as AWS from 'aws-sdk';
import * as path from 'path';

require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env.credentials') });

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
        WithDecryption: true,
      })
      .promise()
  ).Parameter?.Value;

  const translate = (
    await get
      .getParameter({
        Name: process.env.TRANSLATION_API_KEY as string,
        WithDecryption: true,
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

(async () => {
  console.log('regist ssm...');
  await registSSM();
})();
