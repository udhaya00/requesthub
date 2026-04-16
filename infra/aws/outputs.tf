output "alb_dns_name" {
  value       = aws_lb.backend.dns_name
  description = "Public DNS name for the backend load balancer."
}

output "backend_service_url" {
  value       = "http://${aws_lb.backend.dns_name}"
  description = "Base URL for the backend API."
}

output "cloudfront_distribution_id" {
  value       = aws_cloudfront_distribution.frontend.id
  description = "CloudFront distribution ID used for frontend invalidation."
}

output "frontend_bucket_name" {
  value       = aws_s3_bucket.frontend.id
  description = "S3 bucket that stores the built frontend assets."
}

output "frontend_url" {
  value       = local.frontend_url
  description = "Public URL for the frontend."
}

output "ecr_repository_url" {
  value       = aws_ecr_repository.backend.repository_url
  description = "ECR repository URL for the backend container image."
}

output "ecr_repository_name" {
  value       = aws_ecr_repository.backend.name
  description = "ECR repository name for deployment workflows."
}

output "ecs_cluster_name" {
  value       = aws_ecs_cluster.main.name
  description = "ECS cluster name."
}

output "ecs_service_name" {
  value       = aws_ecs_service.backend.name
  description = "ECS service name."
}

output "ecs_task_definition_family" {
  value       = aws_ecs_task_definition.backend.family
  description = "Task definition family used by the backend service."
}

output "backend_container_name" {
  value       = local.backend_container_name
  description = "Container name referenced during ECS deployments."
}

output "backend_container_port" {
  value       = var.container_port
  description = "Container port referenced in the AppSpec file during blue/green deployments."
}

output "codedeploy_application_name" {
  value       = aws_codedeploy_app.backend.name
  description = "CodeDeploy application used for ECS blue/green deployments."
}

output "codedeploy_deployment_group_name" {
  value       = aws_codedeploy_deployment_group.backend.deployment_group_name
  description = "CodeDeploy deployment group used for ECS blue/green deployments."
}

output "github_actions_role_arn" {
  value       = local.create_github_deploy_role ? aws_iam_role.github_actions_deploy[0].arn : null
  description = "OIDC deployment role ARN for GitHub Actions."
}
