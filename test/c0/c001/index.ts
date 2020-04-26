import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '@src/app';
import { DBHelper } from '@src/utils';
import { Groups } from '@src/queries';

chai.use(chaiHttp);
chai.should();

describe('C001', () => {
  it('Case001', async () => {
    const URL = '/groups/Group004';
    const res = await chai.request(server).del(URL).set('authorization', 'User002').send();

    chai.expect(res.status).to.be.eq(200);

    const result = await DBHelper().get(Groups.get({ id: 'Group004', userId: 'User002' }));

    chai.expect(result).is.undefined;
  });
});
