variable "region" {
  type = string
  description = "Region for the AWS resources"
  default = "us-east-2"
}

variable "phoenix_image" {
  description = "Docker image for phoenix"
  default = "rctechclub/phoenix:prod"
}

variable "phoenix_port" {
  description = "Docker image PORT for phoenix"
  default = 4000
}

variable "prisma_image" {
  description = "Docker image for prisma"
  default = "prismagraphql/prisma:1.34"
}

variable "fargate_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = "256"
}

variable "fargate_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default     = "1024"
}

variable "az_count" {
  description = "Number of subnets"
  default = 2
}

variable "ecs_task_execution_role_name" {
  default = "phoenix"
}

variable "GOOGLE_CLIENT_ID" {}
variable "NODEMAILER_PASSWORD" {}
variable "PRISMA_HOST" {}
variable "PRISMA_SECRET" {}
