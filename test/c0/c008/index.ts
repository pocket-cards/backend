import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '@app';

chai.use(chaiHttp);
chai.should();

describe('C008', () => {
  // 10件超え
  it('Case001', async () => {
    const URL = '/groups/C008-1/review';
    const res = await chai.request(server).get(URL).set('authorization', 'C008-1').send();
    console.log(JSON.stringify(res.body));

    chai.expect(res.status).to.be.eq(200);
    chai.expect(res.body).to.have.property('count', 10);
  });

  // 10件未満
  it('Case002', async () => {
    const URL = '/groups/C008-2/review';
    const res = await chai.request(server).get(URL).set('authorization', 'C008-2').send();

    chai.expect(res.status).to.be.eq(200);
    chai.expect(res.body).to.be.deep.eq(require('./datas/res002.json'));
  });

  // 0件
  it('Case003', async () => {
    const URL = '/groups/C999/review';
    const res = await chai.request(server).get(URL).set('authorization', 'C999').send();

    chai.expect(res.status).to.be.eq(200);
    chai.expect(res.body).to.be.deep.eq(require('./datas/res003.json'));
  });
});
