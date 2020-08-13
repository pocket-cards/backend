import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiHttp from 'chai-http';
import server from '@app';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { DBHelper } from '@utils';
import { Groups } from '@queries';

chai.use(chaiHttp);
chai.use(chaiExclude);
chai.should();

describe('B004', () => {
  AWSMock.setSDKInstance(AWS);

  it('Case001', async () => {
    // mock prepare
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: AWS.DynamoDB.DocumentClient.PutItemInput, callback: any) => {
      chai.expect(params).to.be.deep.eq(require('./datas/put001.json'));

      callback(null, 'Success');
    });

    // mock prepare
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: AWS.DynamoDB.DocumentClient.GetItemOutput, callback: any) => {
      callback(null, {
        Item: require('./datas/db001.json'),
      } as AWS.DynamoDB.DocumentClient.GetItemOutput);
    });

    const req = require('./datas/req001.json');
    const URL = '/groups/B004';
    const res = await chai.request(server).put(URL).set('authorization', 'B004').send(req);

    chai.expect(res.status).to.be.eq(200);

    const result = await DBHelper().get(Groups.get({ id: 'B004', userId: 'B004' }));

    chai.expect(result.Item).to.be.deep.eq(require('./datas/res001.json'));
  });
});

afterEach(() => {
  // mock clear
  AWSMock.restore('DynamoDB.DocumentClient');
});
