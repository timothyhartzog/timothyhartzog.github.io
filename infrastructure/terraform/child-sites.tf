# Dynamically create child site infrastructure from the child_sites variable.
# Add entries in terraform.tfvars as new repos are created.

module "child_site" {
  source   = "./modules/child-site"
  for_each = var.child_sites

  project_id    = var.project_id
  region        = var.region
  name          = each.key
  parent_domain = var.domain
  parent_bucket = google_storage_bucket.website.name
  description   = each.value.description
}
