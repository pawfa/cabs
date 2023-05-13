provider "aws" {
  region = var.region
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "prod-k8s-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/28"]
  public_subnets  = ["10.0.101.0/28"]

  tags = {
    Terraform = "true"
    Environment = "prod"
  }
}
