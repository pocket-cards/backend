import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '@app';

chai.use(chaiHttp);
chai.should();

describe('C004', () => {
  it('Case001', async () => {
    const URL = '/groups/C004/words/C004-1';
    const req = require('./datas/req001.json');
    const res = await chai.request(server).put(URL).set('authorization', 'C004').send(req);

    console.log(JSON.stringify(res.body));
    chai.expect(res.body).to.be.deep.eq(require('./datas/res001.json'));
  });
});
