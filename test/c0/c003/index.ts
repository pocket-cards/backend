import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '@src/app';

chai.use(chaiHttp);
chai.should();

describe('C003', () => {
  it('Case001', async () => {
    const URL = '/groups/C003/words/C003-1';
    const res = await chai.request(server).get(URL).set('authorization', 'C003').send();

    chai.expect(res.body).to.be.deep.eq(require('./datas/res001.json'));
  });
});
