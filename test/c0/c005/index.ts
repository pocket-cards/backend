import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '@app';
import { DBHelper } from '@utils';
import { Words } from '@queries';

chai.use(chaiHttp);
chai.should();

describe('C005', () => {
  it('Case001', async () => {
    const URL = '/groups/C005/words/C005-1';
    const res = await chai.request(server).del(URL).set('authorization', 'C005').send();

    chai.expect(200).to.be.eq(res.status);

    // 削除データの検索
    const result = await DBHelper().get(Words.get({ id: 'C005-1', groupId: 'C005' }));

    chai.expect(result).is.undefined;
  });
});
