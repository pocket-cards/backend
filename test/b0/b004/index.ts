import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '@src/app';
import { DBHelper } from '@src/utils';
import { Groups } from '@src/queries';

chai.use(chaiHttp);
chai.should();

describe('B004', () => {
  it('Case001', async () => {
    const req = require('./datas/req001.json');
    const URL = '/groups/Group003';
    const res = await chai.request(server).put(URL).set('authorization', 'User002').send(req);

    chai.expect(res.status).to.be.eq(200);

    const result = await DBHelper().get(Groups.get({ id: 'Group003', userId: 'User002' }));

    chai.expect(result.Item).to.be.deep.eq(require('./datas/res001.json'));
  });
});
