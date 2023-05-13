provider "aws" {
  region = var.region
}

locals {
  cluster_name = "prod-eks-${random_string.suffix.result}"
}

resource "random_string" "suffix" {
  length  = 8
  special = false
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "prod-k8s-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/28", "10.0.2.0/28"]
  public_subnets  = ["10.0.3.0/28","10.0.4.0/28"]

  tags = {
    Terraform = "true"
    Environment = "prod"
  }
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.5.1"

  cluster_name    = local.cluster_name
  cluster_version = "1.24"

  vpc_id                         = module.vpc.vpc_id
  subnet_ids                     = module.vpc.private_subnets
  cluster_endpoint_public_access = true
}