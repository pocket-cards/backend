import { ECS, EC2, ApiGatewayV2 } from 'aws-sdk';

const CLUSTER_ARN = process.env.CLUSTER_ARN;
const API_ID = process.env.API_ID;
const INTEGRATION_ID = process.env.INTEGRATION_ID;

export default async () => {
  const ecs = new ECS();
  const ec2 = new EC2();

  // list tasks
  const tasks = await ecs
    .listTasks({
      cluster: CLUSTER_ARN,
    })
    .promise();

  // list numbers check
  if (tasks.taskArns.length === 0) {
    return {
      status: 'STOPPED',
    };
  }

  const details = await ecs
    .describeTasks({
      cluster: CLUSTER_ARN,
      tasks: tasks.taskArns,
    })
    .promise();

  const task = details.tasks[0];

  if (task.lastStatus !== 'RUNNING') {
    return {
      status: task.lastStatus,
    };
  }

  // find eni infomation
  const enis = task.attachments.map((item) => {
    const f = item.details.find((i) => i.name === 'networkInterfaceId');

    return f.value;
  });

  // get eni details
  const eniDetails = await ec2
    .describeNetworkInterfaces({
      NetworkInterfaceIds: enis,
    })
    .promise();

  // get public ip
  const publicIp = eniDetails.NetworkInterfaces[0].Association.PublicIp;

  const api = new ApiGatewayV2();

  // update integration target ip
  await api
    .updateIntegration({
      ApiId: API_ID,
      IntegrationId: INTEGRATION_ID,
      IntegrationUri: `http://${publicIp}/{proxy}`,
    })
    .promise();

  return {
    status: task.lastStatus,
  };
};
