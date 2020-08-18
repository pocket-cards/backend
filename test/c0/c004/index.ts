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

describe('C004', () => {
  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('Case001', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: AWS.DynamoDB.DocumentClient.UpdateItemInput, callback: any) => {
      chai.expect(params).excluding('ExpressionAttributeValues').to.be.deep.eq(require('./datas/params001.json'));
      chai.expect(params.ExpressionAttributeValues[':times']).to.be.eq(2);

      callback(null, 'success');
    });

    const URL = '/groups/C004/words/WORD-4';
    const req = require('./datas/req001.json');
    const res = await chai.request(server).put(URL).set('authorization', HEADER_AUTH).send(req);

    chai.expect(res.status).to.be.eq(200);
  });
});
