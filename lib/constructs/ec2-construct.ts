import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

interface Ec2ConstructProps {
  vpc: ec2.IVpc;
}

export class Ec2Construct extends Construct {
  constructor(scope: Construct, id: string, props: Ec2ConstructProps) {
    super(scope, id);

    const sg = new ec2.SecurityGroup(this, 'EC2SG', {
      vpc: props.vpc,
      allowAllOutbound: true
    });

    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'SSH');
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'HTTP');

    new ec2.Instance(this, 'Instance', {
      vpc: props.vpc,
      instanceType: new ec2.InstanceType('t3.micro'),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      securityGroup: sg,
      keyName: 'mykey', // 🔥 must exist in AWS
    });
  }
}