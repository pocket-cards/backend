// import chai from 'chai';
// import * as AWSMock from 'aws-sdk-mock';
// // import { AWS } from '@utils/clientUtils';
// // import { handler } from '@src/C0/C006';
// import { DynamoDB } from 'aws-sdk';

// chai.should();

// const get = (filename: string) => require(`./datas/${filename}`);

// describe('C006 Test', () => {
//   it.skip('Test01: Path Parameter is not exists', async () => {
//     const res = await handler(get('test01_req.json'));

//     chai.expect(res).to.be.deep.eq(get('test01_res.json'));
//   });

//   it('Test02: No Target word', async () => {
//     AWSMock.setSDKInstance(AWS);
//     AWSMock.mock(
//       'DynamoDB.DocumentClient',
//       'query',
//       (params: DynamoDB.DocumentClient.QueryInput, callback: Function) => {
//         console.log(params);
//         callback(null, '1111');
//       }
//     );

//     const res = await handler(get('test02_req.json'));

//     chai.expect(res).to.be.deep.eq(get('test02_res.json'));

//     AWSMock.restore('DynamoDB.DocumentClient');
//   });
// });
