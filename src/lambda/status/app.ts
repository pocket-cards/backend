import { ECS } from 'aws-sdk';

const CLUSTER_ARN = process.env.CLUSTER_ARN;

export default async () => {
  const ecs = new ECS();

  // list tasks
  const tasks = await ecs
    .listTasks({
      cluster: CLUSTER_ARN,
    })
    .promise();

  // list numbers check
  if (tasks.taskArns.length === 0) {
    return 'STOPPED';
  }

  const details = await ecs
    .describeTasks({
      cluster: CLUSTER_ARN,
      tasks: tasks.taskArns,
    })
    .promise();

  const task = details.tasks[0];

  return task.lastStatus;
};
