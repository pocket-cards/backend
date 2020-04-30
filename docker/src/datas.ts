import { Helper } from 'dynamodb-helper';
import * as path from 'path';

require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const AWS_ENDPOINT = process.env.AWS_ENDPOINT;
const DEFAULT_REGION = process.env.DEFAULT_REGION;

const helper = new Helper({
  options: {
    endpoint: AWS_ENDPOINT,
    region: DEFAULT_REGION,
  },
});

const insert = async () => {
  console.log('Insert PocketCards_Groups...');
  await helper.bulk(process.env.TABLE_GROUPS as string, require('../datas/Groups.json'));

  console.log('Insert PocketCards_Words...');
  await helper.bulk(process.env.TABLE_WORDS as string, require('../datas/Words.json'));

  console.log('Insert PocketCards_WordMaster...');
  await helper.bulk(process.env.TABLE_WORD_MASTER as string, require('../datas/WordMaster.json'));
};

(async () => {
  await insert();
})();
