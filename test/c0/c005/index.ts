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
    AWSMock.mock('DynamoDB.DocumentClient', 'transactWrite', (params: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput, callback: any) => {
      const del = params.TransactItems[0].Delete;
      const upd = params.TransactItems[1].Update;

      chai.expect(require('./datas/001_params_del.json')).to.be.deep.eq(del);
      chai.expect(require('./datas/001_params_upd.json')).to.be.deep.eq(upd);

      callback(null, 'success');
    });

    const URL = '/groups/C005/words/C005-1';
    const res = await chai.request(server).delete(URL).set('authorization', HEADER_AUTH).send();

    chai.expect(200).to.be.eq(res.status);
  });
});
