import { ECS, EC2, ApiGatewayV2 } from 'aws-sdk';

const CLUSTER_ARN = process.env.CLUSTER_ARN;
const SERVICE_NAME = process.env.SERVICE_NAME;
const API_ID = process.env.API_ID;
const INTEGRATION_ID = process.env.INTEGRATION_ID;

export default async () => {
  const ecs = new ECS();
  const ec2 = new EC2();

  // update service
  await ecs
    .updateService({
      cluster: CLUSTER_ARN,
      service: SERVICE_NAME,
      desiredCount: 1,
    })
    .promise();

  let tasks: ECS.ListTasksResponse | undefined;

  for (;;) {
    // get task
    tasks = await ecs
      .listTasks({
        cluster: CLUSTER_ARN,
      })
      .promise();

    if (tasks.taskArns.length !== 0) {
      break;
    }

    await sleep(5000);
  }

  const taskArns = tasks.taskArns;

  let runningTask: ECS.Task | undefined;

  for (;;) {
    // get task details
    const details = await ecs
      .describeTasks({
        cluster: CLUSTER_ARN,
        tasks: taskArns,
      })
      .promise();

    const task = details.tasks[0];

    if (task.lastStatus === 'RUNNING') {
      break;
    }

    await sleep(5000);
  }

  // find eni infomation
  const enis = runningTask.attachments.map((item) => {
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
      IntegrationUri: `http://${publicIp}`,
    })
    .promise();
};

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(() => resolve(), timeout));
