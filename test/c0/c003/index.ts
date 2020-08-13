import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '@app';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { HEADER_AUTH } from '@test/Commons';

chai.use(chaiHttp);
chai.should();

AWSMock.setSDKInstance(AWS);

describe('C003', () => {
  before(() => {
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: AWS.DynamoDB.DocumentClient.GetItemInput, callback: any) => {
      callback(null, {
        Item: {
          id: 'C003-1',
          groupId: 'C003',
          nextTime: '20190426',
          lastTime: '20190425',
          times: 0,
        },
      });
    });
  });

  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('Case001', async () => {
    const URL = '/groups/C003/words/C003-1';
    const res = await chai.request(server).get(URL).set('authorization', HEADER_AUTH).send();

    chai.expect(res.body).to.be.deep.eq(require('./datas/res001.json'));
  });
});
