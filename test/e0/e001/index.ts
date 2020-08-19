import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiHttp from 'chai-http';
import server from '@app';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { HEADER_AUTH } from '@test/Commons';

chai.use(chaiHttp);
chai.use(chaiExclude);
chai.should();

AWSMock.setSDKInstance(AWS);

describe('C001', () => {
  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('Case001', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: AWS.DynamoDB.DocumentClient.GetItemInput, callback: any) => {
      chai.expect(params).to.be.deep.eq(require('./datas/params001.json'));

      const ret: AWS.DynamoDB.DocumentClient.GetItemOutput = {
        Item: require('./datas/res001.json'),
      };

      callback(null, ret);
    });

    // URL
    const URL = '/words/AAA';
    // request
    const res = await chai.request(server).get(URL).set('authorization', HEADER_AUTH).send();

    // response status
    chai.expect(res.status).to.be.eq(200);
    chai.expect(res.body).to.be.deep.eq(require('./datas/res001.json'));
  });
});
