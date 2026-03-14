variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "name" {
  description = "Short name for the child site (used in resource names)"
  type        = string
}

variable "parent_domain" {
  description = "Parent domain (e.g., hartzog.ai)"
  type        = string
}

variable "parent_bucket" {
  description = "Parent website bucket name (for CORS)"
  type        = string
}

variable "description" {
  description = "Site description"
  type        = string
  default     = ""
}
