import { Output, OutputInstance } from '@pulumi/pulumi';
import { cloudfront } from '@pulumi/aws';

export * from './backend';
export * from './frontend';
export * from './install';
export * from './initial';

export namespace Backend {
  interface Inputs {
    ECS: ECSInputs;
    API: APIInputs;
  }

  interface ECSInputs {
    ClusterArn: Output<string>;
    ServiceArn: Output<string>;
  }

  interface APIInputs {
    ApiId: Output<string>;
    ExecutionArn: Output<string>;
    IntegrationId: Output<string>;
    AuthorizerId: Output<string>;
  }
}

export interface Outputs {
  Bucket: {
    Audio: BucketOutputs;
    Images: BucketOutputs;
    Frontend: BucketOutputs;
    Artifacts: BucketOutputs;
  };
  Cognito: {
    UserPoolId: Output<string>;
    UserPoolClientId: Output<string>;
  };
  CloudFront: CloudFrontOutputs;
  APIGateway: {
    API: {
      Id: Output<string>;
      Arn: Output<string>;
      ExecutionArn: Output<string>;
      Endpoint: Output<string>;
    };
    Authorizer: {
      Id: Output<string>;
      Name: Output<string>;
      AuthorizerType: Output<string>;
    };
    Integration: IntegrationOutputs[];
  };
  VPC: {
    Name?: Output<string>;
    Id: Output<string>;
    Arn: Output<string>;
    CidrBlock: Output<string>;
    DefaultRouteTable: Output<string>;
    EnableDnsHostnames: OutputInstance<boolean | undefined>;
    EnableDnsSupport: OutputInstance<boolean | undefined>;
  };
  SubnetIds: Output<string>[];
  ECS: ECSOutputs;
  Test?: any;
}

interface CloudFrontOutputs {
  Arn: Output<string>;
  DomainName: Output<string>;
  Enabled: OutputInstance<boolean>;
  Origins: Output<
    {
      DomainName: string;
      OriginId: string;
      OriginPath: string | undefined;
    }[]
  >;
  CertificateArn: OutputInstance<string | undefined>;
  IdentityId: Output<string>;
  AccessIdentityPath: Output<string>;
}

interface IntegrationOutputs {
  Id: Output<string>;
  Method: Output<string>;
  Type: Output<string>;
  Uri: Output<string>;
}

interface BucketOutputs {
  bucketName: Output<string>;
  bucketArn: Output<string>;
  bucketDomainName: Output<string>;
}

interface ECSOutputs {
  Cluster: {
    Name: Output<string>;
    Arn: Output<string>;
  };
  Service: {
    Arn: Output<string>;
    TaskDefinition: Output<string>;
    DesiredCount: OutputInstance<number | undefined>;
  };
}
