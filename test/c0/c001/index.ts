import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiHttp from 'chai-http';
import server from '@app';
import { DBHelper, ClientUtils } from '@utils';
import { WordMaster } from '@queries';
import { C001Request } from 'typings/api';

chai.use(chaiHttp);
chai.use(chaiExclude);
chai.should();

describe('C001', () => {
  it('Case001', async () => {
    const URL = '/groups/C001/words';
    const res = await chai
      .request(server)
      .post(URL)
      .set('authorization', 'C001')
      .send({
        words: ['WORD-1', 'Japan', 'China'],
      } as C001Request);

    chai.expect(res.status).to.be.eq(200);

    // data regist
    const words = [];
    words.push((await DBHelper().get(WordMaster.get('Japan'))).Item);
    words.push((await DBHelper().get(WordMaster.get('China'))).Item);

    chai.expect(words).excluding('mp3').to.be.deep.eq(require('./datas/res001.json'));

    // s3 file exists
    const s3Ret = await ClientUtils.s3()
      .listObjectsV2({
        Bucket: process.env.MP3_BUCKET as string,
      })
      .promise();

    const objectKeys = s3Ret.Contents.map((item) => item.Key);
    chai.expect(objectKeys).to.include.members(words.map((item) => item.mp3));
  });

  it('Case002', async () => {
    const URL = '/groups/C001/words';
    const res = await chai
      .request(server)
      .post(URL)
      .set('authorization', 'C001')
      .send({
        words: ['WORD-1', 'WORD-2', 'WORD-3'],
      } as C001Request);

    chai.expect(res.status).to.be.eq(200);
  });
});
