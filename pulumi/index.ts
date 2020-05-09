import { StackReference } from '@pulumi/pulumi';
import { Consts, Envs } from './src/consts';
import Lambda from './src/lambda';
import { Outputs } from 'typings';

export let outputs: any;

const start = () => {
  const stackName = `wwalpha/${Consts.PROJECT_NAME}/${Envs.ENVIRONMENT}-architecture`;
  const architecture = new StackReference(stackName);

  outputs = architecture.outputs.apply((item) => {
    const main = item.outputs as Outputs;

    const lambda = Lambda({
      API: {
        ApiId: main.APIGateway.API.Id,
        IntegrationId: main.APIGateway.Integration[0].Id,
        ExecutionArn: main.APIGateway.API.ExecutionArn,
        AuthorizerId: main.APIGateway.Authorizer.Id,
      },
      ECS: {
        ClusterArn: main.ECS.Cluster.Arn,
        ServiceArn: main.ECS.Service.Arn,
      },
    });

    return {
      Lambda: lambda.map((item) => ({
        Name: item.name,
        Arn: item.arn,
        InvokeArn: item.invokeArn,
        Runtime: item.runtime,
        Timeout: item.timeout,
        RoleArn: item.role,
      })),
    };
  });
};

start();
