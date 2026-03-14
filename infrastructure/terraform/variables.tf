variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "Default GCP region"
  type        = string
  default     = "us-central1"
}

variable "domain" {
  description = "Primary domain name"
  type        = string
  default     = "hartzog.ai"
}

variable "environment" {
  description = "Environment name (prod, staging)"
  type        = string
  default     = "prod"
}

variable "enable_cloud_run" {
  description = "Enable Cloud Run API service"
  type        = bool
  default     = false
}

variable "enable_firestore" {
  description = "Enable Firestore database"
  type        = bool
  default     = false
}

variable "child_sites" {
  description = "Map of child project sites to deploy"
  type = map(object({
    bucket_suffix = string
    description   = string
  }))
  default = {}
}
