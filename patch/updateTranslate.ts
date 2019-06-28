import { DynamoDB } from 'aws-sdk';
import axios from 'axios';

const REGION = 'ap-northeast-1';
const api_url = 'https://translation.googleapis.com/language/translate/v2';
const api_key = process.env.TF_VAR_translation_api_key;

const start = async () => {
  const client = new DynamoDB.DocumentClient({
    region: REGION,
  });

  const results = await client
    .scan({
      TableName: 'PocketCards_GroupWords',
    })
    .promise();

  if (!results.Items) {
    return;
  }

  for (const idx in results.Items) {
    const item = results.Items[idx];

    const ret = await client
      .get({
        TableName: 'PocketCards_Words',
        Key: {
          word: item.word,
        },
      })
      .promise();

    if (!ret.Item) {
      await client
        .delete({
          TableName: 'PocketCards_GroupWords',
          Key: {
            id: item.id,
            word: item.word,
          },
        })
        .promise();
    }
    // if (item.word === item.vocChn) {
    //   console.log(item.word);

    //   await client.delete({
    //     TableName: 'PocketCards_Words',
    //     Key: {
    //       word: item.word,
    //     },
    //   });
    // }
  }

  // for (const idx in results.Items) {
  //   const item = results.Items[idx];
  //   const word = item.word;

  //   if (item.vocJpn.length <= 5) {
  //     continue;
  //   }
  //   console.log(word, idx);
  //   const ja = await getValue(word, 'ja');
  //   const zh = await getValue(word, 'zh');

  //   await client
  //     .update({
  //       TableName: 'PocketCards_Words',
  //       Key: {
  //         word,
  //       },
  //       UpdateExpression: 'set #vocChn = :vocChn, #vocJpn = :vocJpn',
  //       ExpressionAttributeNames: {
  //         '#vocChn': 'vocChn',
  //         '#vocJpn': 'vocJpn',
  //       },
  //       ExpressionAttributeValues: {
  //         ':vocChn': zh,
  //         ':vocJpn': ja,
  //       },
  //     })
  //     .promise();
  // }
};

const getValue = async (word: string, target: string): Promise<string> => {
  let {
    data: {
      data: { translations },
    },
  } = await axios.post(`${api_url}?key=${api_key}`, {
    q: word,
    from: 'en',
    target: target,
    format: 'text',
  });

  return translations[0].translatedText;
};

start();
