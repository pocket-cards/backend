import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '@src/app';

chai.use(chaiHttp);
chai.should();

describe('B002', () => {
  const URL = '/groups';

  it('Case001', async () => {
    const res = await chai.request(server).get(URL).set('authorization', 'User001').send();

    // found 2 records
    chai.expect(res.body).to.be.deep.eq(require('./datas/res001.json'));
  });

  it('Case002', async () => {
    const res = await chai.request(server).get(URL).set('authorization', 'User003').send();

    // not found
    chai.expect(res.body).is.empty;
  });
});
