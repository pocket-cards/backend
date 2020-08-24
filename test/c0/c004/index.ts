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

  // success
  it('Case001', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'transactWrite', (params: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput, callback: any) => {
      const update = params.TransactItems[0].Update;
      const put = params.TransactItems[1].Put;

      try {
        chai.expect(update).excludingEvery(':lastTime').excludingEvery(':nextTime').to.be.deep.eq(require('./datas/params_tw_update_001.json'));
        chai.expect(put).excludingEvery('timestamp').to.be.deep.eq(require('./datas/params_tw_put_001.json'));
      } catch (e) {
        console.log(e);
        throw e;
      }

      callback(null, 'success');
    });

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: AWS.DynamoDB.DocumentClient.GetItemInput, callback: any) => {
      chai.expect(params).to.be.deep.eq(require('./datas/params_get_001.json'));

      const ret: AWS.DynamoDB.DocumentClient.GetItemOutput = { Item: require('./datas/db001.json') };

      callback(null, ret);
    });

    const URL = '/groups/C004/words/WORD-4';
    const req = require('./datas/req001.json');
    const res = await chai.request(server).put(URL).set('authorization', HEADER_AUTH).send(req);

    chai.expect(res.status).to.be.eq(200);
  });

  // failure
  it('Case002', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'transactWrite', (params: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput, callback: any) => {
      const update = params.TransactItems[0].Update;
      const put = params.TransactItems[1].Put;

      try {
        chai.expect(update).excludingEvery(':lastTime').excludingEvery(':nextTime').to.be.deep.eq(require('./datas/params_tw_update_002.json'));
        chai.expect(put).excludingEvery('timestamp').excludingEvery('lastTime').to.be.deep.eq(require('./datas/params_tw_put_002.json'));
      } catch (e) {
        console.log(e);
        throw e;
      }

      callback(null, 'success');
    });

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: AWS.DynamoDB.DocumentClient.GetItemInput, callback: any) => {
      try {
        chai.expect(params).to.be.deep.eq(require('./datas/params_get_002.json'));
      } catch (e) {
        console.log(e);
        throw e;
      }

      const ret: AWS.DynamoDB.DocumentClient.GetItemOutput = { Item: require('./datas/db002.json') };

      callback(null, ret);
    });

    const URL = '/groups/C004/words/WORD-4';
    const req = require('./datas/req002.json');
    const res = await chai.request(server).put(URL).set('authorization', HEADER_AUTH).send(req);

    chai.expect(res.status).to.be.eq(200);
  });

  // new word exsit
  it('Case003', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'transactWrite', (params: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput, callback: any) => {
      const del = params.TransactItems[0].Delete;

      try {
        chai.expect(del).to.be.deep.eq(require('./datas/003_params_tw_del.json'));
      } catch (e) {
        console.log(e);
        throw e;
      }

      callback(null, 'success');
    });

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: AWS.DynamoDB.DocumentClient.GetItemInput, callback: any) => {
      const db = require('./datas/003_db.json');

      const ret: AWS.DynamoDB.DocumentClient.GetItemOutput = { Item: db[params.Key['id']] };

      callback(null, ret);
    });

    const URL = '/groups/C004/words/WORD4';
    const req = require('./datas/003_req.json');
    const res = await chai.request(server).put(URL).set('authorization', HEADER_AUTH).send(req);

    chai.expect(res.status).to.be.eq(200);
  });

  // new word not exist
  it.skip('Case004', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'transactWrite', (params: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput, callback: any) => {
      const put = params.TransactItems[0].Put;
      const del = params.TransactItems[1].Delete;

      console.log(put, del);
      try {
        // chai.expect(del).to.be.deep.eq(require('./datas/004_params_tw_del.json'));
      } catch (e) {
        console.log(e);
        throw e;
      }

      callback(null, 'success');
    });

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: AWS.DynamoDB.DocumentClient.GetItemInput, callback: any) => {
      const db = require('./datas/004_db.json');

      const ret: AWS.DynamoDB.DocumentClient.GetItemOutput = { Item: db[params.Key['id']] };

      callback(null, ret);
    });

    const URL = '/groups/C004/words/WORD4';
    const req = require('./datas/004_req.json');
    const res = await chai.request(server).put(URL).set('authorization', HEADER_AUTH).send(req);

    chai.expect(res.status).to.be.eq(200);
  });
});
