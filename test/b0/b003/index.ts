import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '@src/app';

chai.use(chaiHttp);
chai.should();

describe('B003', () => {
  it('Case001', async () => {
    const URL = '/groups/B003';
    const res = await chai.request(server).get(URL).set('authorization', 'B003').send();

    chai.expect(res.body).to.be.deep.eq(require('./datas/res001.json'));
  });
});
