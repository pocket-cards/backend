import { ssm, route53, acm } from '@pulumi/aws';

export namespace Install {
  // ----------------------------------------------------------------------------------------------
  // Install Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Outputs {
    Route53: Route53Outputs;
    ACM: ACM.Outputs;
  }

  // ----------------------------------------------------------------------------------------------
  // Parameter Store Outputs
  // ----------------------------------------------------------------------------------------------
  export interface ParameterOutputs {
    Github: ssm.Parameter;
    Pulumi: ssm.Parameter;
  }

  // ----------------------------------------------------------------------------------------------
  // Route53 Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Route53Outputs {
    Zone: route53.Zone;
  }

  // ----------------------------------------------------------------------------------------------
  // Route53 Outputs
  // ----------------------------------------------------------------------------------------------
  namespace ACM {
    interface Outputs {
      Record: route53.Record;
      Tokyo: ACMOutputs;
      Virginia: ACMOutputs;
    }

    interface ACMOutputs {
      Certificate: acm.Certificate;
      CertificateValidation: acm.CertificateValidation;
    }

    interface Certificates {
      Tokyo: acm.Certificate;
      Virginia: acm.Certificate;
    }

    interface Validations {
      Tokyo: acm.CertificateValidation;
      Virginia: acm.CertificateValidation;
    }
  }
}
