import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';

export class MyCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Samplebucket', {
      bucketName: "diw-test-bucket1",
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      //autoDeleteObjects: true,
    });

    new s3deploy.BucketDeployment(this, 'DeployFolders', {
      destinationBucket: bucket,
      sources: [s3deploy.Source.asset(path.join(__dirname, '../s3-assets'))],
    });
  }
}
