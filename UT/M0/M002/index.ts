import chai from 'chai';
import * as AWSMock from 'aws-sdk-mock';
import { AWS } from '@utils/clientUtils';
import { handler } from '@src/M0/M002';
import { getResponse } from '@utils/utils';

chai.should();

AWSMock.setSDKInstance(AWS);
AWSMock.mock('Lambda', 'invoke', async (params: AWS.Lambda.InvocationRequest, callback: Function) => {
  chai
    .expect(JSON.parse(params.Payload as string))
    .to.deep.equal({ message: 'CodePipeline Build Success...\nProject: PocketCards-Backend' });

  callback(null, getResponse(200));
});

describe('M002 Test', () => {
  it('Call Slack Lambda:200', async () => {
    AWSMock.mock('Lambda', 'invoke', async (params: AWS.Lambda.InvocationRequest, callback: Function) => {
      chai
        .expect(JSON.parse(params.Payload as string))
        .to.deep.equal({ message: 'CodePipeline Build Success...\nProject: PocketCards-Backend' });

      callback(null, getResponse(200));
    });

    const res = await handler({
      Records: [
        {
          EventSource: 'aws:sns',
          EventVersion: '1.0',
          EventSubscriptionArn:
            'arn:aws:sns:ap-northeast-1:999999999999:PocketCards_BuildNotify:44d129f3-bf33-4c23-a931-153e07f8ac96',
          Sns: {
            Type: 'Notification',
            MessageId: 'aeb2622e-fed5-538b-9eb1-3456e3ebe7d8',
            TopicArn: 'arn:aws:sns:ap-northeast-1:999999999999:PocketCards_BuildNotify',
            Subject: null,
            Message:
              '{"account":"999999999999","detailType":"CodePipeline Pipeline Execution State Change","region":"ap-northeast-1","source":"aws.codepipeline","time":"2019-12-21T13:15:35Z","notificationRuleArn":"arn:aws:codestar-notifications:ap-northeast-1:999999999999:notificationrule/856415ed895da3611a98071df41ed5998ea4071e","detail":{"pipeline":"PocketCards-Backend","execution-id":"1860100a-64a0-4a1f-a757-9128d60ba168","state":"SUCCEEDED","version":3.0},"resources":["arn:aws:codepipeline:ap-northeast-1:999999999999:PocketCards-Backend"],"additionalAttributes":{}}',
            Timestamp: '2019-12-21T13:15:42.890Z',
            SignatureVersion: '1',
            Signature: 'F8AFnv5iOHmGBpcVGMTEJOcDCicMad8yXe4DTWLrESIokI6xd8VUAStmU9SySY',
            SigningCertUrl:
              'https://sns.ap-northeast-1.amazonaws.com/SimpleNotificationService-6aad65c2f9911b05cd53efda11f913f9.pem',
            UnsubscribeUrl:
              'https://sns.ap-northeast-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:ap-northeast-1:999999999999:PocketCards_BuildNotify:44d129f3-bf33-4c23-a931-153e07f8ac96',
            MessageAttributes: {}
          }
        }
      ]
    });

    chai.expect(res).to.deep.equal(getResponse(200));
  });

  it('Call Slack Lambda:500', async () => {
    const res = await handler({
      Records: []
    });

    chai.expect(res).to.deep.equal(getResponse(500));
  });
});
