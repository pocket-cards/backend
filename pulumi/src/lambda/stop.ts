import { AssetArchive, StringAsset } from '@pulumi/pulumi/asset';
import { iam, lambda } from '@pulumi/aws';
import { Consts, Principals, Policy } from '../consts';
import { Backend } from 'typings';

export default (inputs: Backend.ECSInputs) => {
  const role = getRole();

  const func = new lambda.Function('lambda.function.ecs.stop', {
    name: `${Consts.PROJECT_NAME_UC}_ECS_Stop`,
    code: new AssetArchive({
      // 'index.js': new FileAsset(path.join(__dirname, './index.js')),
      'index.js': new StringAsset(Consts.LAMBDA_CODE),
    }),
    handler: 'index.handler',
    role: role.arn,
    runtime: 'nodejs12.x',
    memorySize: 256,
    environment: {
      variables: {
        CLUSTER_ARN: inputs.ClusterArn,
        SERVICE_NAME: inputs.ServiceArn,
      },
    },
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
