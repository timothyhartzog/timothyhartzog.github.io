---
name: gcp-deploy
description: Manage Google Cloud deployment for Hartzog.ai. Initialize GCP project, run Terraform, enable dual-deploy, or perform DNS cutover.
disable-model-invocation: true
argument-hint: "[init|plan|apply|dual-deploy|cutover|status]"
---

# Google Cloud Deployment Manager

Manage the GCP infrastructure for Hartzog.ai.

## Commands

### `/gcp-deploy init`
First-time setup:
1. Check if `gcloud` CLI is installed, prompt to install if not
2. Run `gcloud auth login` and `gcloud config set project hartzog-ai`
3. Copy `infrastructure/terraform/terraform.tfvars.example` → `terraform.tfvars`
4. Prompt user to fill in `project_id`
5. Run `terraform init` in `infrastructure/terraform/`

### `/gcp-deploy plan`
1. Run `terraform plan` in `infrastructure/terraform/`
2. Show what resources will be created
3. Highlight estimated costs

### `/gcp-deploy apply`
1. Run `terraform plan` first and show summary
2. Ask for confirmation
3. Run `terraform apply -auto-approve`
4. Display outputs (CDN IP, bucket name, nameservers)

### `/gcp-deploy dual-deploy`
Enable deploying to both GitHub Pages and GCP simultaneously:
1. Read `.github/workflows/deploy.yml`
2. Uncomment the GCP deployment steps
3. Remind user to set GitHub secrets:
   - `GCP_SA_KEY`: Service account JSON key
   - `GCP_BUCKET_NAME`: Cloud Storage bucket name (from Terraform output)
4. Commit the workflow change

### `/gcp-deploy cutover`
Switch DNS from GitHub Pages to GCP:
1. Show current DNS configuration
2. Display the CDN IP from Terraform outputs
3. Provide instructions to update DNS at registrar
4. Warn about propagation time (up to 48 hours)
5. Suggest keeping GitHub Pages active as fallback

### `/gcp-deploy status`
1. Check if GCP project exists and is configured
2. Show Terraform state summary
3. Check if dual-deploy is enabled in GitHub Actions
4. Show current DNS resolution for hartzog.ai
5. Report which environment is active (GitHub Pages, GCP, or both)

## Important Notes
- Always run `terraform plan` before `apply`
- Never delete the GitHub Pages setup — keep it as fallback
- The `infrastructure/terraform/terraform.tfvars` file contains secrets — it's in `.gitignore`
- All Terraform state should be stored remotely in Cloud Storage (uncomment backend in main.tf after first apply)
