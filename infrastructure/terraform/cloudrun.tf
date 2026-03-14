# Cloud Run API service — only created when enable_cloud_run = true
# This will host server-side features: form processing, auth, analytics API, etc.

resource "google_cloud_run_v2_service" "api" {
  count    = var.enable_cloud_run ? 1 : 0
  name     = "hartzog-ai-api-${var.environment}"
  location = var.region
  project  = var.project_id

  template {
    containers {
      # Placeholder image — replace with your API image
      image = "gcr.io/cloudrun/hello"

      env {
        name  = "ENVIRONMENT"
        value = var.environment
      }

      env {
        name  = "DOMAIN"
        value = var.domain
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      startup_probe {
        http_get {
          path = "/health"
        }
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }
  }

  depends_on = [google_project_service.apis]
}

# Allow unauthenticated access to the API
resource "google_cloud_run_v2_service_iam_member" "public" {
  count    = var.enable_cloud_run ? 1 : 0
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.api[0].name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Serverless NEG for load balancer routing
resource "google_compute_region_network_endpoint_group" "api" {
  count                 = var.enable_cloud_run ? 1 : 0
  name                  = "hartzog-ai-api-neg-${var.environment}"
  region                = var.region
  project               = var.project_id
  network_endpoint_type = "SERVERLESS"

  cloud_run {
    service = google_cloud_run_v2_service.api[0].name
  }
}

# Backend service for Cloud Run (used by CDN url_map path_matcher)
resource "google_compute_backend_service" "api" {
  count       = var.enable_cloud_run ? 1 : 0
  name        = "hartzog-ai-api-backend-${var.environment}"
  project     = var.project_id
  protocol    = "HTTPS"
  timeout_sec = 30

  backend {
    group = google_compute_region_network_endpoint_group.api[0].id
  }
}
