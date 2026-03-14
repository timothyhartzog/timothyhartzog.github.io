output "cdn_ip" {
  description = "Global IP address for DNS A record"
  value       = google_compute_global_address.website.address
}

output "website_bucket" {
  description = "Cloud Storage bucket name for static assets"
  value       = google_storage_bucket.website.name
}

output "website_url" {
  description = "Website URL"
  value       = "https://www.${var.domain}"
}

output "dns_nameservers" {
  description = "Nameservers for the DNS zone (point your registrar here)"
  value       = google_dns_managed_zone.website.name_servers
}

output "cloud_run_url" {
  description = "Cloud Run API URL (if enabled)"
  value       = var.enable_cloud_run ? google_cloud_run_v2_service.api[0].uri : "Not enabled"
}
