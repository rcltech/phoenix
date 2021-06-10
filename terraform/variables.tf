variable "heroku_api_key" {
  type        = string
  description = "Heroku account api key"
  sensitive   = true
}

variable "region" {
  type        = string
  description = "Heroku region"
  default     = "us"
}

variable "release_tag" {
  type        = string
  description = "Phoenix release tag"
  default     = "latest"
}

// application secrets
variable "phoenix_secret" {
  type        = string
  description = "Phoenix application secret"
  sensitive   = true
}

variable "google_client_id" {
  type        = string
  description = "Google client ID for oauth"
  sensitive   = true
}

variable "nodemailer_password" {
  type        = string
  description = "Nodemailer password"
  sensitive   = true
}

variable "aws_access_key" {
  type        = string
  description = "AWS access key"
  sensitive   = true
}

variable "aws_secret_access_key" {
  type        = string
  description = "AWS secret access key"
  sensitive   = true
}

variable "sls_secret" {
  type        = string
  description = "SLS secret"
  sensitive   = true
}
