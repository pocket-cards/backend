import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiHttp from 'chai-http';
import server from '@app';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { DBHelper, Commons } from '@utils';
import { Groups } from '@queries';
import { HEADER_AUTH } from '../../Commons';

chai.use(chaiHttp);
chai.use(chaiExclude);
chai.should();

describe('B005', () => {
  AWSMock.setSDKInstance(AWS);

  it('Case001', async () => {
    // mock prepare
    AWSMock.mock('DynamoDB.DocumentClient', 'delete', (params: AWS.DynamoDB.DocumentClient.DeleteItemInput, callback: any) => {
      chai.expect(params).to.be.deep.eq(require('./datas/del001.json'));

      callback(null, 'Success');
    });

    const URL = '/groups/B005';
    const res = await chai.request(server).del(URL).set('authorization', HEADER_AUTH).send();

    // status code
    chai.expect(res.status).to.be.eq(200);

    const userId = Commons.getUserInfo(HEADER_AUTH);
    const result = await DBHelper().get(Groups.get({ id: 'B005', userId: userId }));

    // response
    chai.expect(result).is.undefined;
  });
});

afterEach(() => {
  // mock clear
  AWSMock.restore('DynamoDB.DocumentClient');
});
