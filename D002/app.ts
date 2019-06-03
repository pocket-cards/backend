import { Polly, S3 } from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import { Result } from './index';

// Polly
let client: Polly;

const excludeId: number[] = [];

export const app = async (event: APIGatewayEvent): Promise<Result> => {
  if (!event.body) {
    return (undefined as unknown) as Result;
  }

  // Polly Client初期化
  if (!client) {
    client = new Polly({
      region: process.env.AWS_REGION
    });
  }

  /**  */
  const request: Polly.SynthesizeSpeechInput = {
    Text: '',
    TextType: 'ssml',
    VoiceId: 'Joanna',
    OutputFormat: 'mp3',
    LanguageCode: 'en-US'
  };

  return {};
};
