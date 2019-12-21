import { lambda } from '@utils/clientUtils';

const CALL_SLACK_FUNCTION = process.env.CALL_SLACK_FUNCTION as string;

export default async (event: any): Promise<void> => {
  const project = event.detail.pipeline;
  const state = event.detail.state;

  const client = lambda();

  // 非同期でLambdaを呼び出す
  await client
    .invoke({
      FunctionName: CALL_SLACK_FUNCTION,
      InvocationType: 'Event',
      Payload: JSON.stringify({
        message: `CodePipeline Build ${state}...\nProject: ${project}`
      })
    })
    .promise();
};
