import chai from 'chai';
import chaiHttp from 'chai-http';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import server from '@app';
import { HEADER_AUTH } from '@test/Commons';

chai.use(chaiHttp);
chai.should();

AWSMock.setSDKInstance(AWS);

describe('C005', () => {
  it('Case001', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'delete', (params: AWS.DynamoDB.DocumentClient.DeleteItemInput, callback: any) => {
      chai.expect(require('./datas/input001.json')).to.be.deep.eq(params);

      callback(null, 'success');
    });

    const URL = '/groups/C005/words/C005-1';
    const res = await chai.request(server).delete(URL).set('authorization', HEADER_AUTH).send();

    chai.expect(200).to.be.eq(res.status);
  });
});
