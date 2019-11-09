import chai from 'chai';
import chaiHttp from 'chai-http';
import test001_input from './test001_input.json';
import test001_output from './test001_output.json';

chai.use(chaiHttp);

const API_URL = process.env.API_ENDPOINT as string;

describe('B002 Test', () => {
  it('Normally Success.', async () => {
    const res = await chai.request(API_URL).get('/groups');

    chai.expect(res.body).to.deep.eq(require('./test001_input.json'));
  });
});
