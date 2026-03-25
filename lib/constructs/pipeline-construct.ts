import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'ArtifactsBucket', {
  versioned: true,
});

    // 1️⃣ Source Repo
    const repo = new codecommit.Repository(this, 'MyRepo', {
      repositoryName: 'my-cdk-repo',
    });

    // 2️⃣ Build Project
      const buildProject: any = new codebuild.PipelineProject(this, 'BuildProject', {
          environment: {
              buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
          },

          environmentVariables: {
              BUCKET_NAME: {
                  value: bucket.bucketName,
              },
          },
      });

       // Grant permission
          bucket.grantWrite(buildProject);


    // 3️⃣ Pipeline
    const pipeline = new codepipeline.Pipeline(this, 'MyPipeline', {
      pipelineName: 'MyCdkPipeline',
    });

    // Artifacts
    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();

    // 4️⃣ Source Stage
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new actions.CodeCommitSourceAction({
          actionName: 'Source',
          repository: repo,
          output: sourceOutput,
        }),
      ],
    });

    // 5️⃣ Build Stage
    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new actions.CodeBuildAction({
          actionName: 'Build',
          project: buildProject,
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    });
  }
}