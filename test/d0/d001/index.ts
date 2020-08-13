import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '@app';
import { HEADER_AUTH } from '../../Commons';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import App from '@test/server';

chai.use(chaiHttp);
chai.should();

describe('C001', () => {
  before(() => {
    App.listen(9000, () => console.log('test server started...'));

    AWSMock.mock('SSM', 'getParameter', (params: AWS.SSM.Types.GetParameterRequest, callback: any) => {
      if (params.Name === '/pocket-cards/vision-url') {
        callback(null, {
          Parameter: {
            Value: 'http://localhost:9000',
          },
        } as AWS.SSM.Types.GetParameterResult);
        return;
      }

      if (params.Name === '/pocket-cards/vision-api-key') {
        callback(null, {
          Parameter: {
            Value: 'ABCDEFGHIGKLIMN',
          },
        } as AWS.SSM.Types.GetParameterResult);
        return;
      }
    });
  });

  after(() => {
    App.removeAllListeners();

    AWSMock.restore('SSM');
  });

  it('Case001', async () => {
    const URL = '/image2text';
    // request
    const req = require('./datas/req001.json');
    const res = await chai.request(server).post(URL).set('authorization', HEADER_AUTH).send(req);

    // response status
    chai.expect(res.status).to.be.eq(200);

    // response except
    chai.expect(res.body).to.be.deep.eq(require('./datas/res001.json'));
  });
});
