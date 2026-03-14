# Child site bucket — serves as a path under the parent domain
# e.g., https://www.hartzog.ai/projects/rust-data-viz/
# OR as its own GitHub Pages subdomain until migrated

resource "google_storage_bucket" "site" {
  name     = "hartzog-ai-${var.name}"
  location = var.region
  project  = var.project_id

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  cors {
    origin          = ["https://${var.parent_domain}", "https://www.${var.parent_domain}"]
    method          = ["GET", "HEAD"]
    response_header = ["Content-Type"]
    max_age_seconds = 3600
  }
}

resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.site.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}
