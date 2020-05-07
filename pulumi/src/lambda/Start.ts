import { AssetArchive, FileAsset, StringAsset } from '@pulumi/pulumi/asset';
import { iam, lambda } from '@pulumi/aws';
import * as path from 'path';
import { Consts, Principals, Policy } from '../consts';
import { Backend } from 'typings';

export default (inputs: Backend.Inputs) => {
  const role = getRole();

  const func = new lambda.Function('lambda.function.ecs.start', {
    name: `${Consts.PROJECT_NAME_UC}_ECS_Start`,
    code: new AssetArchive({
      // 'index.js': new FileAsset(path.join(__dirname, './index.js')),
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
        API_ID: inputs.API.ApiId,
        INTEGRATION_ID: inputs.API.IntegrationId,
      },
    },
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
