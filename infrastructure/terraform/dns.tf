# Cloud DNS managed zone
resource "google_dns_managed_zone" "website" {
  name        = "hartzog-ai-zone"
  dns_name    = "${var.domain}."
  description = "DNS zone for ${var.domain}"
  project     = var.project_id

  depends_on = [google_project_service.apis]
}

# A record → CDN IP
resource "google_dns_record_set" "apex" {
  name         = "${var.domain}."
  type         = "A"
  ttl          = 300
  managed_zone = google_dns_managed_zone.website.name
  rrdatas      = [google_compute_global_address.website.address]
}

# www CNAME → apex
resource "google_dns_record_set" "www" {
  name         = "www.${var.domain}."
  type         = "CNAME"
  ttl          = 300
  managed_zone = google_dns_managed_zone.website.name
  rrdatas      = ["${var.domain}."]
}
