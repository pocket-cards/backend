import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiHttp from 'chai-http';
import server from '@app';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { HEADER_AUTH } from '@test/Commons';
import App from '@test/server';

chai.use(chaiHttp);
chai.use(chaiExclude);
chai.should();

AWSMock.setSDKInstance(AWS);

describe('C001', () => {
  const URL = '/groups/group001/words';

  before(() => {
    App.listen(9001, () => console.log('test server started...'));
  });

  after(() => {
    App.removeAllListeners();
  });

  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it.skip('Case001', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: any, callback: any) => {
      console.log(params);
      callback(null, 'success');
    });

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: AWS.DynamoDB.DocumentClient.GetItemInput, callback: any) => {
      console.log(params);

      let data = {};

      if (params.Key.id === 'first' || params.Key.id === 'your') {
        data = {
          Item: {
            id: params.Key.id,
          },
        };
      }

      callback(null, data);
    });

    // request
    const req = require('./datas/req001.json');
    const res = await chai.request(server).post(URL).set('authorization', HEADER_AUTH).send(req);

    // response status
    chai.expect(res.status).to.be.eq(200);
  });

  it('Case002', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: any, callback: any) => {
      console.log(params);
      callback(null, 'success');
    });

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: AWS.DynamoDB.DocumentClient.GetItemInput, callback: any) => {
      console.log(params);

      let data = {};

      if (params.Key.id === 'first' || params.Key.id === 'your') {
        data = {
          Item: {
            id: params.Key.id,
          },
        };
      }

      callback(null, data);
    });

    // request
    const req = require('./datas/req002.json');
    const res = await chai.request(server).post(URL).set('authorization', HEADER_AUTH).send(req);

    // response status
    chai.expect(res.status).to.be.eq(200);
  });
});
