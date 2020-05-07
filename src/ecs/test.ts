import { ApiGatewayV2 } from 'aws-sdk';

(async () => {
  const api = new ApiGatewayV2();

  const ret = await api
    .updateIntegration({
      ApiId: 'n7u39epg4i',
      IntegrationId: 'op0bnnk',
      IntegrationUri: 'http://13.231.186.133',
    })
    .promise();

  console.log(ret);
})();
