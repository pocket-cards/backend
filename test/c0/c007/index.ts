import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiHttp from 'chai-http';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import server from '@app';
import { HEADER_AUTH } from '@test/Commons';

chai.use(chaiHttp);
chai.use(chaiExclude);
chai.should();

AWSMock.setSDKInstance(AWS);

describe('C007', () => {
  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  // 10件超え
  it('Case001', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: AWS.DynamoDB.DocumentClient.QueryInput, callback: any) => {
      chai.expect(params).excluding('ExpressionAttributeValues').to.be.deep.eq(require('./datas/query001.json'));

      callback(null, require('./datas/queryResult001.json'));
    });

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: AWS.DynamoDB.DocumentClient.GetItemInput, callback: any) => {
      const num = (params.Key.id as string).split('-')[1];

      callback(null, {
        Item: {
          id: params.Key.id,
          pronounce: `Pronounce_${num}`,
          vocChn: `WORD_ZH_${num}`,
          vocJpn: `WORD_JA_${num}`,
          mp3: `URL_MP3_${num}`,
        },
      });
    });

    const URL = '/groups/C007/test';
    const res = await chai.request(server).get(URL).set('authorization', HEADER_AUTH).send();

    chai.expect(res.status).to.be.eq(200);
    chai.expect(res.body).to.be.deep.eq(require('./datas/res001.json'));
  });

  // 0件
  it('Case002', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: AWS.DynamoDB.DocumentClient.QueryInput, callback: any) => {
      chai.expect(params).excluding('ExpressionAttributeValues').to.be.deep.eq(require('./datas/query002.json'));

      callback(null, {
        Count: 0,
        Items: [],
      });
    });

    const URL = '/groups/C999/test';
    const res = await chai.request(server).get(URL).set('authorization', HEADER_AUTH).send();

    chai.expect(res.status).to.be.eq(200);
    chai.expect(res.body).to.be.deep.eq(require('./datas/res002.json'));
  });
});
