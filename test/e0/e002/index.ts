import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiHttp from 'chai-http';
import server from '@app';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { HEADER_AUTH } from '@test/Commons';
import { E002Request } from 'typings/api';

chai.use(chaiHttp);
chai.use(chaiExclude);
chai.should();

AWSMock.setSDKInstance(AWS);

describe('E002', () => {
  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it.skip('Case001', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: AWS.DynamoDB.DocumentClient.GetItemInput, callback: any) => {
      chai.expect(params.Key).to.be.deep.eq({ id: 'AAA' });

      const ret: AWS.DynamoDB.DocumentClient.GetItemOutput = {
        Item: require('./datas/db001.json'),
      };

      callback(null, ret);
    });

    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: AWS.DynamoDB.DocumentClient.PutItemInput, callback: any) => {
      // chai.expect(params).to.be.deep.eq(require('./datas/params001.json'));
      console.log(params);

      const ret: AWS.DynamoDB.DocumentClient.PutItemOutput = {};

      callback(null, ret);
    });

    // URL
    const URL = '/words/AAA';
    // request
    const res = await chai
      .request(server)
      .put(URL)
      .set('authorization', HEADER_AUTH)
      .send({
        id: 'AAA',
        mp3: 'URL_MP3_1',
        pronounce: 'Pronounce_1',
        vocJpn: 'WORD_JA_1',
        vocChn: 'WORD_ZH_1',
      } as E002Request);

    // response status
    chai.expect(res.status).to.be.eq(200);
  });

  it('Case002', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: AWS.DynamoDB.DocumentClient.GetItemInput, callback: any) => {
      chai.expect(params.Key).to.be.deep.eq({ id: 'Text' });

      const ret: AWS.DynamoDB.DocumentClient.GetItemOutput = {
        Item: undefined,
      };

      callback(null, ret);
    });

    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: AWS.DynamoDB.DocumentClient.PutItemInput, callback: any) => {
      chai.expect(params).excludingEvery('mp3').to.be.deep.eq(require('./datas/002_params_put.json'));

      callback(null, 'success');
    });

    // URL
    const URL = '/words/Text';
    // request
    const res = await chai.request(server).put(URL).set('authorization', HEADER_AUTH).send();

    // response status
    chai.expect(res.status).to.be.eq(200);
  });
});
