# MyTestRepo

**Create the project**
mkdir my-cdk-project
cd my-cdk-project
cdk init app --language typescript

**Install S3 module**
npm install @aws-cdk/aws-s3

**Create the construct in lib/cdk-s3-demo-stack.ts**

**Bootstrap the env**
cdk bootstrap

**deploy the project**
cdk deploy

****Setting up glue job**
npm install aws-cdk-lib constructs
npm install @aws-cdk/aws-glue-alpha
npm install aws-cdk-lib/aws-s3-deployment

**If you encounter error Cannot create an instance of an abstract class.ts(2511)**
npm install aws-cdk-lib@2.217.0 constructs@^10.0.0
npm install @aws-cdk/aws-glue-alpha@2.217.0-alpha.0
npm install
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm install --save-dev @types/jest



