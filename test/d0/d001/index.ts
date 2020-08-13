import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '@app';
import { HEADER_AUTH } from '../../Commons';
import App from '@test/server';

chai.use(chaiHttp);
chai.should();

describe('C001', () => {
  before(() => {
    App.listen(9000, () => console.log('test server started...'));
  });

  after(() => {
    App.removeAllListeners();
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
