# Static website hosting bucket
resource "google_storage_bucket" "website" {
  name     = "hartzog-ai-website-${var.environment}"
  location = var.region
  project  = var.project_id

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  cors {
    origin          = ["https://${var.domain}", "https://www.${var.domain}"]
    method          = ["GET", "HEAD"]
    response_header = ["Content-Type"]
    max_age_seconds = 3600
  }

  # Lifecycle: delete old versions after 30 days
  lifecycle_rule {
    condition {
      num_newer_versions = 3
    }
    action {
      type = "Delete"
    }
  }

  versioning {
    enabled = true
  }

  depends_on = [google_project_service.apis]
}

# Make bucket publicly readable
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.website.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Terraform state bucket (create manually first, then uncomment backend in main.tf)
# resource "google_storage_bucket" "terraform_state" {
#   name     = "hartzog-ai-terraform-state"
#   location = var.region
#   project  = var.project_id
#
#   versioning {
#     enabled = true
#   }
#
#   uniform_bucket_level_access = true
# }
