resource "aws_codepipeline" "codepipeline" {
  name     = "cabs-pipeline"
  role_arn = aws_iam_role.codepipeline_role.arn

  artifact_store {
    location = aws_s3_bucket.codepipeline_bucket.bucket
    type     = "S3"

    encryption_key {
      id   = data.aws_kms_alias.s3kmskey.arn
      type = "KMS"
    }
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeCommit"
      version          = "1"
      output_artifacts = ["source_output"]

      configuration = {
        RepositoryName       = "cabs"
        BranchName           = "main"
        PollForSourceChanges = true
      }
    }
  }

  stage {
    name = "Build"

    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      output_artifacts = ["build_output"]
      version          = "1"

      configuration = {
        ProjectName = "cabs"
      }
    }
  }
}

data "template_file" "buildspec" {
  template = "${file("../buildspec.yml")}"
}

resource "aws_codebuild_project" "cabs" {
  name          = "cabs"
  description   = "cabs_codebuild_project"
  build_timeout = "5"
  service_role  = aws_iam_role.codepipeline_role.arn

  artifacts {
    encryption_disabled    = false
    name                   = "static-web-build-prod"
    override_artifact_name = false
    packaging              = "NONE"
    type                   = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:4.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
  }

  source {
    buildspec           = data.template_file.buildspec.rendered
    git_clone_depth     = 0
    insecure_ssl        = false
    type                = "CODEPIPELINE"
  }

  tags = {
    Environment = "prod"
  }
}

resource "aws_codecommit_repository" "cabs" {
  repository_name = "cabs"
  description     = "This is the Sample Cabs Repository"
}