import { AssetArchive, StringAsset } from '@pulumi/pulumi/asset';
import { iam, lambda, apigatewayv2 } from '@pulumi/aws';
import { Consts, Principals, Policy } from '../consts';
import { Backend } from 'typings';
import { interpolate } from '@pulumi/pulumi';

export default (inputs: Backend.Inputs) => {
  const role = getRole();

  // lambda function
  const func = new lambda.Function(
    'lambda.function.ecs.status',
    {
      name: `${Consts.PROJECT_NAME_UC}_ECS_Status`,
      code: new AssetArchive({
        'index.js': new StringAsset(Consts.LAMBDA_CODE),
      }),
      handler: 'index.handler',
      role: role.arn,
      runtime: 'nodejs12.x',
      memorySize: 256,
      timeout: 10,
      environment: {
        variables: {
          CLUSTER_ARN: inputs.ECS.ClusterArn,
          API_ID: inputs.API.ApiId,
          INTEGRATION_ID: inputs.API.IntegrationId,
        },
      },
    },
    { ignoreChanges: ['code', 'lastModified', 'sourceCodeHash'] }
  );

  // integration
  const integration = new apigatewayv2.Integration('apigateway.integration.status', {
    apiId: inputs.API.ApiId,
    connectionType: 'INTERNET',
    description: 'Lambda Integration',
    integrationMethod: 'POST',
    integrationType: 'AWS_PROXY',
    integrationUri: func.arn,
    payloadFormatVersion: '2.0',
    timeoutMilliseconds: 29000,
    passthroughBehavior: 'WHEN_NO_MATCH',
  });

  // start
  new apigatewayv2.Route('apigateway.route.status', {
    apiId: inputs.API.ApiId,
    routeKey: 'GET /status',
    authorizationType: 'JWT',
    authorizerId: inputs.API.AuthorizerId,
    target: interpolate`integrations/${integration.id}`,
  });

  // start option
  new apigatewayv2.Route('apigateway.route.status.option', {
    apiId: inputs.API.ApiId,
    routeKey: 'OPTIONS /status',
    target: interpolate`integrations/${integration.id}`,
  });

  // permission
  new lambda.Permission('lambda.permission.ecs.status', {
    statementId: 'lambda_permission_ecs_status',
    action: 'lambda:InvokeFunction',
    function: func.name,
    principal: 'apigateway.amazonaws.com',
    sourceArn: interpolate`${inputs.API.ExecutionArn}/*/*/status`,
  });

  return func;
};

const getRole = () => {
  const role = new iam.Role('iam.role.lambda.ecs.status', {
    name: `${Consts.PROJECT_NAME_UC}_Lambda_ECSStatusRole`,
    assumeRolePolicy: Principals.LAMBDA,
  });

  new iam.RolePolicy('iam.policy.lambda.ecs.status', {
    name: 'inline_policy',
    role: role.id,
    policy: Policy.Lambda_ECSStatus,
  });
  return role;
};
