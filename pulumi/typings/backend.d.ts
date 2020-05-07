import { ec2, ecs, servicediscovery, lb, route53, apigatewayv2, ecr, s3, dynamodb, acm, cognito } from '@pulumi/aws';
import { Initial } from './initial';
import { Install } from './install';
import { Output } from '@pulumi/pulumi';

export namespace Backend {
  // ----------------------------------------------------------------------------------------------
  // Backend Outputs
  // ----------------------------------------------------------------------------------------------
  interface Inputs {
    Route53: Route53Input;
    ECR: ecr.Repository;
    Cognito: CognitoInputs;
    ACM: acm.Certificate;
    S3: S3Inputs;
    DynamoDB: DynamoDBInputs;
  }

  // ----------------------------------------------------------------------------------------------
  // VPC Inputs
  // ----------------------------------------------------------------------------------------------
  interface VPCInputs {
    Id: Output<string>;
    Subnets: Output<string>[];
  }

  // ----------------------------------------------------------------------------------------------
  // Route53 Inputs
  // ----------------------------------------------------------------------------------------------
  interface Route53Input {
    Zone: route53.Zone;
  }

  // ----------------------------------------------------------------------------------------------
  // DynamoDB Inputs
  // ----------------------------------------------------------------------------------------------
  interface DynamoDBInputs {
    Users: dynamodb.Table;
    Words: dynamodb.Table;
    Groups: dynamodb.Table;
    History: dynamodb.Table;
    WordMaster: dynamodb.Table;
  }

  // ----------------------------------------------------------------------------------------------
  // S3 Inputs
  // ----------------------------------------------------------------------------------------------
  interface S3Inputs {
    Audio: s3.Bucket;
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
  // Backend Outputs
  // ----------------------------------------------------------------------------------------------
  interface Outputs {
    VPC: VPC.Outputs;
    ECS: ECS.Outputs;
    APIGateway: API.Outputs;
  }

  // ----------------------------------------------------------------------------------------------
  // Route53 Inputs
  // ----------------------------------------------------------------------------------------------
  interface Route53Inputs {
    Zone: route53.Zone;
  }

  // ----------------------------------------------------------------------------------------------
  // ACM Outputs
  // ----------------------------------------------------------------------------------------------
  interface ACMOutputs {}

  namespace VPC {
    type Outputs = VPCOutputs & SubnetOutputs;

    // ----------------------------------------------------------------------------------------------
    // VPC Outputs
    // ----------------------------------------------------------------------------------------------
    interface VPCOutputs {
      VPC: ec2.Vpc;
      IGW?: ec2.InternetGateway;
      RouteTable?: ec2.RouteTable;
      DefaultSecurityGroup: ec2.DefaultSecurityGroup;
    }

    // ----------------------------------------------------------------------------------------------
    // Subnet Outputs
    // ----------------------------------------------------------------------------------------------
    interface SubnetOutputs {
      Subnets: ec2.Subnet[];
    }
  }

  namespace ECS {
    // ----------------------------------------------------------------------------------------------
    // Outputs
    // ----------------------------------------------------------------------------------------------
    interface Inputs {
      TaskDef: TaskDefinition;
      VPC: Backend.VPC.Outputs;
      S3: S3Inputs;
    }

    // ----------------------------------------------------------------------------------------------
    // Outputs
    // ----------------------------------------------------------------------------------------------
    type Outputs = ECSOutputs;

    // ----------------------------------------------------------------------------------------------
    // ECS Outputs
    // ----------------------------------------------------------------------------------------------
    interface ECSOutputs {
      Cluster: ecs.Cluster;
      ECSService: ecs.Service;
      TaskDefinition: ecs.TaskDefinition;
    }

    // ----------------------------------------------------------------------------------------------
    // CloudMap Outputs
    // ----------------------------------------------------------------------------------------------
    interface CloudMapOutputs {
      Namespace: servicediscovery.HttpNamespace;
      Service: servicediscovery.Service;
    }

    // ----------------------------------------------------------------------------------------------
    // ELB Outputs
    // ----------------------------------------------------------------------------------------------
    interface ELBOutputs {
      ALB: lb.LoadBalancer;
      Listener: lb.Listener;
      TargetGroup: lb.TargetGroup;
    }

    interface TaskDefinition {
      TABLE_GROUPS: Output<string>;
      TABLE_USERS: Output<string>;
      TABLE_HISTORY: Output<string>;
      TABLE_WORD_MASTER: Output<string>;
      TABLE_WORDS: Output<string>;
      REPO_URL: Output<string>;
      MP3_BUCKET: Output<string>;
    }
  }

  namespace API {
    interface Inputs {
      Route53: Route53Inputs;
      Cognito: CognitoInputs;
      ACM: acm.Certificate;
    }

    // ----------------------------------------------------------------------------------------------
    // Outputs
    // ----------------------------------------------------------------------------------------------
    type Outputs = APIGatewayOutputs & {
      Domain: apigatewayv2.DomainName;
    };

    // ----------------------------------------------------------------------------------------------
    // APIGateway Outputs
    // ----------------------------------------------------------------------------------------------
    interface APIGatewayOutputs {
      API: apigatewayv2.Api;
      Integration: apigatewayv2.Integration;
      Authorizer: apigatewayv2.Authorizer;
      Route: apigatewayv2.Route;
      Stage: apigatewayv2.Stage;
      APIMapping: apigatewayv2.ApiMapping;
    }
  }
}
