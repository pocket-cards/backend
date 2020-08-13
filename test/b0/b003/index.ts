import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiHttp from 'chai-http';
import server from '@app';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';

chai.use(chaiHttp);
chai.use(chaiExclude);
chai.should();

describe('B003', () => {
  AWSMock.setSDKInstance(AWS);

  it('Case001', async () => {
    // mock prepare
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: AWS.DynamoDB.DocumentClient.GetItemInput, callback: any) => {
      const output: AWS.DynamoDB.DocumentClient.GetItemOutput = {
        Item: require('./datas/db001.json'),
      };

      callback(null, output);
    });

    const URL = '/groups/B003';
    const res = await chai.request(server).get(URL).set('authorization', 'B003').send();

    chai.expect(res.body).to.be.deep.eq(require('./datas/res001.json'));
  });
});

afterEach(() => {
  // mock clear
  AWSMock.restore('DynamoDB.DocumentClient');
});
