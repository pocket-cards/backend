import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiHttp from 'chai-http';
import server from '@app';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { HEADER_AUTH } from 'test/Commons';

chai.use(chaiHttp);
chai.use(chaiExclude);
chai.should();

describe('C001', () => {
  const URL = '/groups/group001/words';

  it('Case001', async () => {
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

    AWSMock.restore();
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

    AWSMock.restore();
  });
});
