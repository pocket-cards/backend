import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiHttp from 'chai-http';
import server from '@app';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { HEADER_AUTH } from '../../Commons';

chai.use(chaiHttp);
chai.use(chaiExclude);
chai.should();

describe('B002', () => {
  const URL = '/groups';

  AWSMock.setSDKInstance(AWS);

  it('Case001: Get List Success', async () => {
    // mock prepare
    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: AWS.DynamoDB.DocumentClient.QueryInput, callback: any) => {
      const output: AWS.DynamoDB.DocumentClient.QueryOutput = {
        Count: 0,
        Items: require('./datas/db001.json'),
      };

      callback(null, output);
    });

    const res = await chai.request(server).get(URL).set('authorization', HEADER_AUTH).send();

    // found 2 records
    chai.expect(res.body).to.be.deep.eq(require('./datas/res001.json'));
  });

  it('Case002: Empty List', async () => {
    // mock prepare
    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: AWS.DynamoDB.DocumentClient.QueryInput, callback: any) => {
      const output: AWS.DynamoDB.DocumentClient.QueryOutput = {
        Count: 0,
        Items: [],
      };

      callback(null, output);
    });
    const res = await chai.request(server).get(URL).set('authorization', HEADER_AUTH).send();

    // not found
    chai.expect(res.body).to.be.deep.eq(require('./datas/res002.json'));
  });
});

afterEach(() => {
  // mock clear
  AWSMock.restore('DynamoDB.DocumentClient');
});
