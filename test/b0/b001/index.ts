import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiHttp from 'chai-http';
import server from '@app';
import { DBHelper, Commons } from '@utils';
import { Groups } from '@queries';
import { B001Response } from 'typings/api';

chai.use(chaiHttp);
chai.use(chaiExclude);
chai.should();

const auth =
  'eyJraWQiOiJqTGdTeHdCdG1vNXorSW53ZmlUSEdka3BVNWVGcEI0QjFtNm5wSWxFV0UwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4NGQ5NTA4My05ZWU4LTQxODctYjZlNy04MTIzNTU4ZWYyYzEiLCJhdWQiOiI0aHVncnFnODZqbm1xbDlvdGJ0dmhwbzV0NCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6Ijk5OTVjZTZiLTcxMmUtNGU1Yy05ZDYxLWQ4NWRjYzFlNTY4YSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTg5MDA2MDkzLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtbm9ydGhlYXN0LTFfQ0J3eWUwSHdyIiwiY29nbml0bzp1c2VybmFtZSI6Ijg0ZDk1MDgzLTllZTgtNDE4Ny1iNmU3LTgxMjM1NThlZjJjMSIsImV4cCI6MTU4OTAwOTY5MywiaWF0IjoxNTg5MDA2MDkzLCJlbWFpbCI6Ind3YWxwaGFAZ21haWwuY29tIn0.Z6WmrT7rB_hILmKLiE0MXFossAUW9j8hDmDZppOWjhR2YPpjsMm7AcvGko8sjIq3tRPAg1cYEoR0f5Uz5scRDFv1QD6buWzbQnWbw5Eq6xJmj--otDrsKyZjD8pzCQDhfebvHdgpNIZAF0D7XtDuO8D8XDdLhYwFK1DlFnN-3nwm7GZ-N-O7Z9oZTzzMI_QmZpbUmjLrwZYO3Yg8atj_MPFm-IBQim9jFCqzkTfMvocfcGyyGruKlDjqfn8yohGUKaTFx6TpiYlX5bP7xlqYAtD6qDMjHdvImbxRWLFZ-epzrduZ-erekcRWb6VyKF7rUe8-yJYq091oReKBoWIzrA';

describe('B001', () => {
  it('Case001', async () => {
    const req = require('./datas/req001.json');
    const URL = '/groups';
    const res = await chai.request(server).put(URL).set('authorization', auth).send(req);

    chai.expect(res.status).to.be.eq(200);

    const ret = res.body as B001Response;

    const userId = Commons.getUserInfo(auth);
    const result = await DBHelper().get(Groups.get({ id: ret.groupId, userId: userId }));

    chai.expect(result.Item).excluding('id').to.be.deep.eq(require('./datas/res001.json'));
  });
});