import { expect, use, request, should, assert } from 'chai';
import chaiHttp from 'chai-http';

should();
use(chaiHttp);

describe('test', () => {
  it('Normally Success.', async () => {
    request('http://127.0.0.1:3000/')
      .get('/groups/x001/new')
      .end((err, res) => {
        // expect(err).to.be.null;
        // expect({ a: 1 }).to.deep.equal({ a: 1 });

        // console.log(1111, JSON.parse(JSON.stringify(res.body)));
        const data = JSON.stringify(res.body);
        expect(data).to.eq(
          JSON.stringify({
            message: '111',
          })
        );
      });
  });
});
