import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '@src/app';

chai.use(chaiHttp);
chai.should();

describe('B003', () => {
  it('Case001', async () => {
    const res = await chai.request(server).get('/groups/Group001').set('Authorization', 'User001').send();

    chai.expect(res.body).to.be.deep.eq(require('./datas/res001.json'));
  });
});
