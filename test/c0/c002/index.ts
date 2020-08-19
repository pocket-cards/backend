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

describe('C002', () => {
  const URL = '/groups/group002/words';

  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  // list words
  it('Case001', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: AWS.DynamoDB.DocumentClient.QueryInput, callback: any) => {
      callback(null, {
        Items: require('./datas/db001.json'),
      });
    });

    // URL
    const URL = '/groups/C002/words';
    // request
    const res = await chai.request(server).get(URL).set('authorization', HEADER_AUTH).send();

    // response status
    chai.expect(res.status).to.be.eq(200);

    chai.expect(res.body).to.be.deep.eq(require('./datas/res001.json'));
  });

  // empty words
  it('Case002', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: AWS.DynamoDB.DocumentClient.QueryInput, callback: any) => {
      console.log(params);

      callback(null, []);
    });

    // URL
    const URL = '/groups/C003/words';
    // request
    const res = await chai.request(server).get(URL).set('authorization', HEADER_AUTH).send();

    // response status
    chai.expect(res.status).to.be.eq(200);

    chai.expect(res.body).length.to.be.empty;
  });
});
