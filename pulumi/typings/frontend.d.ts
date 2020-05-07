import { cloudfront, acm, cognito, s3, codebuild, codepipeline, route53, sns } from '@pulumi/aws';

export namespace Frontend {
  // ----------------------------------------------------------------------------------------------
  // Frontend Inputs
  // ----------------------------------------------------------------------------------------------
  export interface Inputs {
    Route53: Route53Inputs;
    S3: S3Input;
    ACM: ACMInputs;
    Cognito: CognitoInputs;
  }

  // ----------------------------------------------------------------------------------------------
  // Route53 Inputs
  // ----------------------------------------------------------------------------------------------
  interface Route53Inputs {
    Zone: route53.Zone;
  }

  // ----------------------------------------------------------------------------------------------
  // S3 Inputs
  // ----------------------------------------------------------------------------------------------
  interface S3Input {
    Frontend: s3.Bucket;
    Audio: s3.Bucket;
    Artifacts: s3.Bucket;
  }

  // ----------------------------------------------------------------------------------------------
  // ACM Inputs
  // ----------------------------------------------------------------------------------------------
  interface ACMInputs {
    Virginia: ACMRegionInputs;
  }

  interface ACMRegionInputs {
    Certificate: acm.Certificate;
    CertificateValidation: acm.CertificateValidation;
  }

  // ----------------------------------------------------------------------------------------------
  // Cognito Inputs
  // ----------------------------------------------------------------------------------------------
  interface CognitoInputs {
    UserPool: cognito.UserPool;
    UserPoolClient: cognito.UserPoolClient;
    IdentityPool: cognito.IdentityPool;
  }

  // ----------------------------------------------------------------------------------------------
  // Frontend Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Outputs {
    CloudFront: CloudFront.Outputs & {
      Identity: cloudfront.OriginAccessIdentity;
    };
    CodePipeline: CodePipeline.Outputs;
  }

  // ----------------------------------------------------------------------------------------------
  // Bucket Policy
  // ----------------------------------------------------------------------------------------------
  namespace BucketPolicy {
    // ----------------------------------------------------------------------------------------------
    //  Inputs
    // ----------------------------------------------------------------------------------------------
    interface Inputs {
      Bucket: {
        Audio: s3.Bucket;
        Frontend: s3.Bucket;
      };
      Identity: cloudfront.OriginAccessIdentity;
    }
  }

  // ----------------------------------------------------------------------------------------------
  // CloudFront
  // ----------------------------------------------------------------------------------------------
  namespace CloudFront {
    interface Inputs {
      Bucket: {
        Audio: s3.Bucket;
        Frontend: s3.Bucket;
      };
      CertificateValidation: acm.CertificateValidation;
      Identity: cloudfront.OriginAccessIdentity;
    }

    type Outputs = CloudFrontOutputs;

    // ----------------------------------------------------------------------------------------------
    // CloudFront Outputs
    // ----------------------------------------------------------------------------------------------
    interface CloudFrontOutputs {
      Distribution: cloudfront.Distribution;
    }
  }

  // ----------------------------------------------------------------------------------------------
  // CodePipeline
  // ----------------------------------------------------------------------------------------------
  namespace CodePipeline {
    // ----------------------------------------------------------------------------------------------
    // Inputs
    // ----------------------------------------------------------------------------------------------
    interface Inputs {
      Cognito: CognitoInputs;
      Bucket: {
        Artifact: s3.Bucket;
        Frontend: s3.Bucket;
      };
      SNSTopic: sns.Topic;
    }
    // ----------------------------------------------------------------------------------------------
    // Outputs
    // ----------------------------------------------------------------------------------------------
    interface Outputs {
      CodeBuild: codebuild.Project;
      CodePipeline: codepipeline.Pipeline;
    }
    // ----------------------------------------------------------------------------------------------
    // Cognito Inputs
    // ----------------------------------------------------------------------------------------------
    interface CognitoInputs {
      UserPool: cognito.UserPool;
      UserPoolClient: cognito.UserPoolClient;
      IdentityPool: cognito.IdentityPool;
    }
  }

  // ----------------------------------------------------------------------------------------------
  // SNS
  // ----------------------------------------------------------------------------------------------
  namespace SNS {
    interface Inputs {
      Distribution: cloudfront.Distribution;
    }

    type Outputs = SNSOutput;

    // ----------------------------------------------------------------------------------------------
    // SNS Outputs
    // ----------------------------------------------------------------------------------------------
    interface SNSOutput {
      Topic: sns.Topic;
    }
  }
}
