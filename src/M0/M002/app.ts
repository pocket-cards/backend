import { lambda } from '@utils/clientUtils';

const CALL_SLACK_FUNCTION = process.env.CALL_SLACK_FUNCTION as string;

export default async (event: any): Promise<void> => {
  const logLink = event.detail['additional-information'].logs['deep-link'];
  const project = event.detail['project-name'];

  const client = lambda();

  // 非同期でLambdaを呼び出す
  await client
    .invoke({
      FunctionName: CALL_SLACK_FUNCTION,
      InvocationType: 'Event',
      Payload: JSON.stringify({
        message: `CodeBuild Error...\nProject: ${project}\nLog Link: <${logLink}|CloudWatch Logs>`
      })
    })
    .promise();
};
