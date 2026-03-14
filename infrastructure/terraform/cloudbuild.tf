# Cloud Build trigger — builds and deploys on push to main
resource "google_cloudbuild_trigger" "website" {
  name        = "hartzog-ai-deploy-${var.environment}"
  description = "Build and deploy Hartzog.ai on push to main"
  project     = var.project_id

  github {
    owner = "timothyhartzog"
    name  = "timothyhartzog.github.io"

    push {
      branch = "^main$"
    }
  }

  filename = "infrastructure/cloudbuild.yaml"

  substitutions = {
    _BUCKET_NAME = google_storage_bucket.website.name
    _ENVIRONMENT = var.environment
  }

  depends_on = [google_project_service.apis]
}

# Service account for Cloud Build
resource "google_service_account" "cloudbuild" {
  account_id   = "hartzog-ai-cloudbuild"
  display_name = "Hartzog.ai Cloud Build"
  project      = var.project_id
}

# Grant Cloud Build permission to write to the bucket
resource "google_storage_bucket_iam_member" "cloudbuild_write" {
  bucket = google_storage_bucket.website.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.cloudbuild.email}"
}

# Grant Cloud Build permission to invalidate CDN cache
resource "google_project_iam_member" "cloudbuild_cdn" {
  project = var.project_id
  role    = "roles/compute.loadBalancerAdmin"
  member  = "serviceAccount:${google_service_account.cloudbuild.email}"
}
