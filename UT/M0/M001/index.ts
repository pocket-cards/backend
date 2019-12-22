import chai from 'chai';
import * as AWSMock from 'aws-sdk-mock';
import { AWS } from '@utils/clientUtils';
import { handler } from '@src/M0/M001';
import { getResponse } from '@utils/utils';

chai.should();

describe('M001 Test', () => {
  AWSMock.setSDKInstance(AWS);

  it('Send message to slack', async () => {
    const res = await handler({ message: 'CodePipeline Build Success...\nProject: PocketCards-Backend' });

    chai.expect(res).to.deep.equal(getResponse(200));
  });
});
