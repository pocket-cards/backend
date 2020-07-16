import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiHttp from 'chai-http';
import server from '@app';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { DBHelper, Commons } from '@utils';
import { Groups } from '@queries';
import { B001Response } from 'typings/api';
import { HEADER_AUTH } from '../../Commons';

chai.use(chaiHttp);
chai.use(chaiExclude);
chai.should();

before(() => {
  AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: any, callback: any) => {
    callback(null, 'success');
  });

  AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: AWS.DynamoDB.DocumentClient.GetItemInput, callback: any) => {
    const output: AWS.DynamoDB.DocumentClient.GetItemOutput = {
      Item: {
        id: 'exAQr4rFop9dDpXbPHYcXp',
        userId: '84d95083-9ee8-4187-b6e7-8123558ef2c1',
        name: 'b001',
        description: 'Description b001',
      },
    };

    callback(null, output);
  });
});

after(() => {
  AWSMock.restore();
});

describe('B001', () => {
  const URL = '/groups';

  it('Case001', async () => {
    // request
    const req = require('./datas/req001.json');
    const res = await chai.request(server).put(URL).set('authorization', HEADER_AUTH).send(req);

    // response status
    chai.expect(res.status).to.be.eq(200);

    const ret = res.body as B001Response;

    const userId = Commons.getUserInfo(HEADER_AUTH);
    const result = await DBHelper().get(Groups.get({ id: ret.groupId, userId: userId }));

    // response except
    chai.expect(result.Item).excluding('id').to.be.deep.eq(require('./datas/res001.json'));
  });
});
