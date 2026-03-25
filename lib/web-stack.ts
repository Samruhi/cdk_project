import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
// import * as sqs from 'aws-cdk-lib/aws-sqs';


import { VpcConstruct } from './constructs/vpc-construct';
// import { S3Construct } from './constructs/s3-construct';
// import { Ec2Construct } from './constructs/ec2-construct';
import { PipelineStack } from './constructs/pipeline-construct';

export class WebStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

  // Create VPC
    const vpcConstruct = new VpcConstruct(this, 'VpcConstruct');

    // // Create EC2 inside VPC
    // new Ec2Construct(this, 'Ec2Construct', {
    //   vpc: vpcConstruct.vpc
    // });

    // // Create S3
    // new S3Construct(this, 'S3Construct');

    const app = new cdk.App();
    new PipelineStack(app, 'PipelineStack');

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'WebQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
