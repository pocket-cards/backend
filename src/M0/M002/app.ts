import { lambda } from '@utils/clientUtils';
import { SNSRecords, EventSource } from '@typings/aws';

const CALL_SLACK_FUNCTION = process.env.CALL_SLACK_FUNCTION as string;

export default async (event: SNSRecords): Promise<void> => {
  const record = event.Records[0];

  const message = JSON.parse(record.Sns.Message) as EventSource;
  const pipeline = message.detail.pipeline;
  const state = message.detail.state;

  const client = lambda();

  // 非同期でLambdaを呼び出す
  await client
    .invoke({
      FunctionName: CALL_SLACK_FUNCTION,
      InvocationType: 'Event',
      Payload: JSON.stringify({
        message: `CodePipeline Build ${state}...\nProject: ${pipeline}`
      })
    })
    .promise();
};
