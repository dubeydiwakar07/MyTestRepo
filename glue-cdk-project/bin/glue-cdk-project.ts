#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { GlueCdkProjectStack } from '../lib/glue-cdk-project-stack';

const app = new cdk.App();
new GlueCdkProjectStack(app, 'GlueCdkProjectStack');
