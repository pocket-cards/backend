import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
chai.should();

describe('test', () => {
  it('Normally Success.', done => {
    chai
      .request('http://127.0.0.1:3000')
      .get('/groups/x001/new')
      .end((err, res) => {
        // expect(err).to.be.null;
        // expect({ a: 1 }).to.deep.equal({ a: 1 });

        chai.expect(res.body).to.deep.eq(require('./test001.json'));
      });
  });
});
