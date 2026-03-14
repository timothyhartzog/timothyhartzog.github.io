# Backend bucket for CDN
resource "google_compute_backend_bucket" "website" {
  name        = "hartzog-ai-backend-${var.environment}"
  bucket_name = google_storage_bucket.website.name
  enable_cdn  = true

  cdn_policy {
    cache_mode                   = "CACHE_ALL_STATIC"
    default_ttl                  = 3600
    max_ttl                      = 86400
    client_ttl                   = 3600
    negative_caching             = true
    serve_while_stale            = 86400
    signed_url_cache_max_age_sec = 0
  }
}

# Reserve a global static IP
resource "google_compute_global_address" "website" {
  name    = "hartzog-ai-ip-${var.environment}"
  project = var.project_id
}

# Google-managed SSL certificate
resource "google_compute_managed_ssl_certificate" "website" {
  name    = "hartzog-ai-cert-${var.environment}"
  project = var.project_id

  managed {
    domains = [var.domain, "www.${var.domain}"]
  }
}

# URL map (routes requests to backend bucket)
resource "google_compute_url_map" "website" {
  name            = "hartzog-ai-urlmap-${var.environment}"
  default_service = google_compute_backend_bucket.website.id

  # If Cloud Run is enabled, route /api/* to Cloud Run
  dynamic "path_matcher" {
    for_each = var.enable_cloud_run ? [1] : []
    content {
      name            = "api"
      default_service = google_compute_backend_bucket.website.id

      path_rule {
        paths   = ["/api/*"]
        service = google_compute_backend_service.api[0].id
      }
    }
  }

  dynamic "host_rule" {
    for_each = var.enable_cloud_run ? [1] : []
    content {
      hosts        = [var.domain, "www.${var.domain}"]
      path_matcher = "api"
    }
  }
}

# HTTPS proxy
resource "google_compute_target_https_proxy" "website" {
  name             = "hartzog-ai-https-proxy-${var.environment}"
  url_map          = google_compute_url_map.website.id
  ssl_certificates = [google_compute_managed_ssl_certificate.website.id]
}

# HTTP proxy (redirects to HTTPS)
resource "google_compute_url_map" "http_redirect" {
  name = "hartzog-ai-http-redirect-${var.environment}"

  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
}

resource "google_compute_target_http_proxy" "http_redirect" {
  name    = "hartzog-ai-http-proxy-${var.environment}"
  url_map = google_compute_url_map.http_redirect.id
}

# Forwarding rules (bind IP to proxies)
resource "google_compute_global_forwarding_rule" "https" {
  name                  = "hartzog-ai-https-${var.environment}"
  target                = google_compute_target_https_proxy.website.id
  ip_address            = google_compute_global_address.website.address
  port_range            = "443"
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

resource "google_compute_global_forwarding_rule" "http" {
  name                  = "hartzog-ai-http-${var.environment}"
  target                = google_compute_target_http_proxy.http_redirect.id
  ip_address            = google_compute_global_address.website.address
  port_range            = "80"
  load_balancing_scheme = "EXTERNAL_MANAGED"
}
