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
        // Create S3 bucket
    const bucket = new s3.Bucket(this, 'Samplebucket', {
      bucketName: "diw-test-bucket1",
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Deploy all folders from s3-assets (inbound, outbound, glue-script)
    new s3deploy.BucketDeployment(this, 'DeployAssets', {
      destinationBucket: bucket,
      sources: [s3deploy.Source.asset(path.join(__dirname, '../s3-assets'))],
      retainOnDelete: false,
    });

    // IAM Role for Glue Job with S3 access permissions
    const glueRole = new iam.Role(this, 'GlueJobRole', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole')
      ]
    });

    // Attach inline policy for S3 access
    glueRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:ListBucket',
        's3:GetObject',
        's3:PutObject'
      ],
      resources: [
        'arn:aws:s3:::s3-assets',
        'arn:aws:s3:::s3-assets/*'
      ]
    }));

    // Define the Glue Job using CfnJob
    new glue.CfnJob(this, 'ScalaGlueJob', {
      name: 'CopyTestFileJob',
      role: glueRole.roleArn,
      command: {
        name: 'glueetl',
        scriptLocation: 's3://s3-assets/glue-script/copy-test.scala',
        pythonVersion: '3'
      },
      defaultArguments: {
        '--job-language': 'scala',
        '--TempDir': 's3://s3-assets/temp/',
        '--enable-metrics': 'true',
        '--inboundPath': 's3://s3-assets/inbound/',
        '--outboundPath': 's3://s3-assets/outbound/'
      },
      maxRetries: 1,
      timeout: 10,
      glueVersion: '4.0',
      numberOfWorkers: 2,
      workerType: 'G.1X'
    });
  }
}