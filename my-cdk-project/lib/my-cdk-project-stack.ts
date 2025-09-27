import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class MyCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'Samplebucket', {
      bucketName:"diw-test-bucket1",
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test
      //autoDeleteObjects: true, // Only for dev/test
    });
  }
}
