// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import server from '@src/app';

// chai.use(chaiHttp);
// chai.should();

// describe('DefaultMuteIntent', () => {
//   it('Case001', async () => {
//     const texts = [...EXCEPT_ARRAY];
//     let count = 0;

//     for (;;) {
//       if (count === LIMIT_RETRY) {
//         console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
//         chai.expect('', texts.toString());
//         console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
//       }

//       const res = await chai.request(server).post('/endpoint').send(require('./datas/request.json'));

//       // 予想値に存在しない
//       if (!EXCEPT_ARRAY.includes(res.text)) {
//         chai.expect(res.text, '');
//       }

//       const index = texts.indexOf(res.text);

//       // すでにテスト済み
//       if (index === -1) {
//         count = count + 1;
//         continue;
//       }

//       // 存在する
//       texts.splice(index, 1);
//       count = 0;

//       if (texts.length === 0) {
//         break;
//       }
//     }
//   });
// });
