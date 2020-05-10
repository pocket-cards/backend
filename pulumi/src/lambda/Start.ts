import { AssetArchive, StringAsset } from '@pulumi/pulumi/asset';
import { iam, lambda, apigatewayv2 } from '@pulumi/aws';
import { Consts, Principals, Policy } from '../consts';
import { Backend } from 'typings';
import { interpolate } from '@pulumi/pulumi';

export default (inputs: Backend.Inputs) => {
  const role = getRole();

  // lambda function
  const func = new lambda.Function(
    'lambda.function.ecs.start',
    {
      name: `${Consts.PROJECT_NAME_UC}_ECS_Start`,
      code: new AssetArchive({
        'index.js': new StringAsset(Consts.LAMBDA_CODE),
      }),
      handler: 'index.handler',
      role: role.arn,
      runtime: 'nodejs12.x',
      memorySize: 256,
      timeout: 90,
      environment: {
        variables: {
          CLUSTER_ARN: inputs.ECS.ClusterArn,
          SERVICE_NAME: inputs.ECS.ServiceArn,
        },
      },
    },
    { ignoreChanges: ['code', 'lastModified', 'sourceCodeHash'] }
  );

  // integration
  const integration = new apigatewayv2.Integration(
    'apigateway.integration.start',
    {
      apiId: inputs.API.ApiId,
      connectionType: 'INTERNET',
      description: 'Lambda Integration',
      integrationMethod: 'POST',
      integrationType: 'AWS_PROXY',
      integrationUri: func.arn,
      payloadFormatVersion: '2.0',
      timeoutMilliseconds: 29000,
      passthroughBehavior: 'WHEN_NO_MATCH',
    }
    // { ignoreChanges: ['passthroughBehavior'] }
  );

  // start
  new apigatewayv2.Route('apigateway.route.start', {
    apiId: inputs.API.ApiId,
    routeKey: 'POST /start',
    authorizationType: 'JWT',
    authorizerId: inputs.API.AuthorizerId,
    target: interpolate`integrations/${integration.id}`,
  });

  // start option
  new apigatewayv2.Route('apigateway.route.start.option', {
    apiId: inputs.API.ApiId,
    routeKey: 'OPTIONS /start',
    target: interpolate`integrations/${integration.id}`,
  });

  // permission
  new lambda.Permission('lambda.permission.ecs.start', {
    statementId: 'lambda_permission_ecs_start',
    action: 'lambda:InvokeFunction',
    function: func.name,
    principal: 'apigateway.amazonaws.com',
    sourceArn: interpolate`${inputs.API.ExecutionArn}/*/*/start`,
  });

  return func;
};

const getRole = () => {
  const role = new iam.Role('iam.role.lambda.ecs.start', {
    name: `${Consts.PROJECT_NAME_UC}_Lambda_ECSStartRole`,
    assumeRolePolicy: Principals.LAMBDA,
  });

  new iam.RolePolicy('iam.policy.lambda.ecs.start', {
    name: 'inline_policy',
    role: role.id,
    policy: Policy.Lambda_ECSStart,
  });
  return role;
};
