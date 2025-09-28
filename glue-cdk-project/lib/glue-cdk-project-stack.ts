import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';
import * as glue from 'aws-cdk-lib/aws-glue';
import * as iam from 'aws-cdk-lib/aws-iam';

export class GlueCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Create S3 bucket
    const bucket = new s3.Bucket(this, 'DiwTestBucket', {
      bucketName: 'diw-test-bucket2',
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Deploy inbound/
    new s3deploy.BucketDeployment(this, 'DeployInbound', {
      destinationBucket: bucket,
      destinationKeyPrefix: 'inbound/', // <--- This keeps the folder structure
      sources: [s3deploy.Source.asset(path.join(__dirname, '../s3-assets/inbound'))],
      retainOnDelete: false,
    });
    
    // Deploy outbound/
    new s3deploy.BucketDeployment(this, 'DeployOutbound', {
      destinationBucket: bucket,
      destinationKeyPrefix: 'outbound/',
      sources: [s3deploy.Source.asset(path.join(__dirname, '../s3-assets/outbound'))],
      retainOnDelete: false,
    });
    
    // Deploy glue-script/
    new s3deploy.BucketDeployment(this, 'DeployGlueScript', {
      destinationBucket: bucket,
      destinationKeyPrefix: 'glue-script/',
      sources: [s3deploy.Source.asset(path.join(__dirname, '../s3-assets/glue-script'))],
      retainOnDelete: false,
    });


    // 3. Create IAM role with S3 full access for Glue job
    const glueRole = new iam.Role(this, 'DiwTestRole', {
      roleName: 'diw-test-role',
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
      ],
    });

    // 4. Create Glue job with specified parameters
    new glue.CfnJob(this, 'CopyJob', {
      name: 'CopyJob',
      role: glueRole.roleArn,
      command: {
        name: 'glueetl',
        scriptLocation: 's3://diw-test-bucket2/glue-script/copy-test.py',
        pythonVersion: '3',
      },
      defaultArguments: {
        '--job-language': 'python 3',
        '--TempDir': 's3://diw-test-bucket2/temp/',
        '--enable-metrics': 'true',
        '--inboundPath': 's3://diw-test-bucket2/inbound/',
        '--outboundPath': 's3://diw-test-bucket2/outbound/',
      },
      maxRetries: 1,
      timeout: 10,
      glueVersion: '4.0',
      numberOfWorkers: 2,
      workerType: 'G.1X',
    });
  }
}
