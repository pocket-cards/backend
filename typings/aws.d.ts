export interface SNSRecords {
  Records: SNSEvent[];
}

export interface SNSEvent {
  EventSource: string;
  EventVersion: string;
  EventSubscriptionArn: string;
  Sns: {
    Type: string;
    MessageId: string;
    TopicArn: string;
    Subject: string | null;
    Message: string;
    Timestamp: string;
    SignatureVersion: string;
    Signature: string;
    SigningCertUrl: string;
    UnsubscribeUrl: string;
    MessageAttributes: {};
  };
}

export interface EventSource {
  account: string;
  detailType: string;
  region: string;
  source: string;
  time: string;
  notificationRuleArn: string;
  detail: {
    pipeline: string;
    'execution-id': string;
    state: string;
    version: number;
  };
  resources: string[];
  additionalAttributes: object;
}
