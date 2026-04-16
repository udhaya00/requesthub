variable "project_name" {
  description = "Application name used in resource naming."
  type        = string
  default     = "smart-request-hub"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region for the deployment."
  type        = string
  default     = "ap-south-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the application VPC."
  type        = string
  default     = "10.20.0.0/16"
}

variable "container_port" {
  description = "Port exposed by the Express application."
  type        = number
  default     = 5000
}

variable "backend_cpu" {
  description = "CPU units for the ECS task."
  type        = number
  default     = 512
}

variable "backend_memory" {
  description = "Memory in MiB for the ECS task."
  type        = number
  default     = 1024
}

variable "backend_desired_count" {
  description = "Desired number of ECS tasks."
  type        = number
  default     = 1
}

variable "backend_image_tag" {
  description = "Initial backend image tag to deploy."
  type        = string
  default     = "latest"
}

variable "backend_deployment_config_name" {
  description = "CodeDeploy traffic shifting configuration for blue/green ECS deployments."
  type        = string
  default     = "CodeDeployDefault.ECSCanary10Percent5Minutes"
}

variable "backend_blue_termination_wait_minutes" {
  description = "Minutes to keep the blue task set after a successful deployment before termination."
  type        = number
  default     = 5
}

variable "frontend_bucket_name" {
  description = "Optional explicit bucket name for the frontend."
  type        = string
  default     = ""
}

variable "mongo_uri" {
  description = "MongoDB connection string used by the API."
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret for the API."
  type        = string
  sensitive   = true
}

variable "jwt_expires_in" {
  description = "JWT expiry used by the server."
  type        = string
  default     = "8h"
}

variable "client_url_override" {
  description = "Optional explicit frontend URL for CORS. Leave empty to use CloudFront domain."
  type        = string
  default     = ""
}

variable "log_retention_days" {
  description = "Retention period for CloudWatch application logs."
  type        = number
  default     = 14
}

variable "github_repository" {
  description = "GitHub repository in owner/name format for OIDC deployment role."
  type        = string
  default     = ""
}

variable "github_branch" {
  description = "Git branch allowed to assume the deployment role."
  type        = string
  default     = "main"
}

variable "github_oidc_provider_arn" {
  description = "Existing IAM OIDC provider ARN for GitHub Actions."
  type        = string
  default     = ""
}
