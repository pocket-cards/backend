import { ECS } from 'aws-sdk';

const CLUSTER_ARN = process.env.CLUSTER_ARN;
const SERVICE_NAME = process.env.SERVICE_NAME;

export default async () => {
  const ecs = new ECS();

  // update service
  await ecs
    .updateService({
      cluster: CLUSTER_ARN,
      service: SERVICE_NAME,
      desiredCount: 1,
    })
    .promise();
};
