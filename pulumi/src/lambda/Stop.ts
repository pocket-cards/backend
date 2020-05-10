import { AssetArchive, StringAsset } from '@pulumi/pulumi/asset';
import { iam, lambda, apigatewayv2 } from '@pulumi/aws';
import { Consts, Principals, Policy } from '../consts';
import { Backend } from 'typings';
import { interpolate } from '@pulumi/pulumi';

export default (inputs: Backend.Inputs) => {
  const role = getRole();

  // lambda function
  const func = new lambda.Function(
    'lambda.function.ecs.stop',
    {
      name: `${Consts.PROJECT_NAME_UC}_ECS_Stop`,
      code: new AssetArchive({
        'index.js': new StringAsset(Consts.LAMBDA_CODE),
      }),
      handler: 'index.handler',
      role: role.arn,
      runtime: 'nodejs12.x',
      timeout: 10,
      memorySize: 256,
      environment: {
        variables: {
          CLUSTER_ARN: inputs.ECS.ClusterArn,
          SERVICE_NAME: inputs.ECS.ServiceArn,
        },
      },
    },
    { ignoreChanges: ['code', 'lastModified', 'sourceCodeHash'] }
  );

  const integration = new apigatewayv2.Integration(
    'apigateway.integration.stop',
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

  // route
  new apigatewayv2.Route('apigateway.route.stop', {
    apiId: inputs.API.ApiId,
    routeKey: 'POST /stop',
    authorizationType: 'JWT',
    authorizerId: inputs.API.AuthorizerId,
    target: interpolate`integrations/${integration.id}`,
  });

  // start option
  new apigatewayv2.Route('apigateway.route.stop.option', {
    apiId: inputs.API.ApiId,
    routeKey: 'OPTIONS /stop',
    target: interpolate`integrations/${integration.id}`,
  });

  new lambda.Permission('lambda.permission.ecs.stop', {
    statementId: 'lambda_permission_ecs_stop',
    action: 'lambda:InvokeFunction',
    function: func.name,
    principal: 'apigateway.amazonaws.com',
    sourceArn: interpolate`${inputs.API.ExecutionArn}/*/*/stop`,
  });

  return func;
};

const getRole = () => {
  const role = new iam.Role('iam.role.lambda.ecs.stop', {
    name: `${Consts.PROJECT_NAME_UC}_Lambda_ECSStopRole`,
    assumeRolePolicy: Principals.LAMBDA,
  });

  new iam.RolePolicy('iam.policy.lambda.ecs.stop', {
    name: 'inline_policy',
    role: role.id,
    policy: Policy.Lambda_ECSStop,
  });
  return role;
};
