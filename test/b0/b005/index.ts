import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '@app';
import { DBHelper } from '@utils';
import { Groups } from '@queries';

chai.use(chaiHttp);
chai.should();

describe('B005', () => {
  it('Case001', async () => {
    const URL = '/groups/B005';
    const res = await chai.request(server).del(URL).set('authorization', 'B005').send();

    chai.expect(res.status).to.be.eq(200);

    const result = await DBHelper().get(Groups.get({ id: 'B005', userId: 'B005' }));

    chai.expect(result).is.undefined;
  });
});
