# Google Cloud Migration Plan

## Architecture: Current → Future

### Current (GitHub Pages — Free Tier)
```
GitHub Repo → GitHub Actions Build → GitHub Pages CDN
                                      ↓
                              www.hartzog.ai (static)
```

### Future (Google Cloud — Scalable)
```
GitHub Repo → Cloud Build → Cloud Storage (static assets)
                               ↓
                          Cloud CDN + Load Balancer
                               ↓
                        www.hartzog.ai
                               ↓
                    Cloud Run (API/SSR when needed)
                               ↓
                    Firestore / Cloud SQL (data)
```

---

## Phase 1: Cloud Foundation (Do When Ready)

Set up the GCP project and basic infrastructure. No user-facing changes yet —
GitHub Pages continues to serve traffic.

### 1.1 GCP Project Setup
- Create GCP project `hartzog-ai`
- Enable APIs: Cloud Build, Cloud Storage, Cloud Run, Cloud CDN, Cloud DNS
- Set up billing alerts ($10, $25, $50 thresholds)
- Create service account for CI/CD with minimal permissions

### 1.2 Terraform Infrastructure-as-Code
Create `infrastructure/` directory with Terraform configs:
- `main.tf` — Provider, project, remote state (Cloud Storage backend)
- `storage.tf` — Cloud Storage bucket for static site hosting
- `cdn.tf` — Cloud CDN + HTTPS load balancer
- `dns.tf` — Cloud DNS zone for hartzog.ai
- `cloudbuild.tf` — Cloud Build trigger (on push to main)
- `cloudrun.tf` — Cloud Run service (placeholder for future API)
- `variables.tf` — Configurable project ID, region, domain
- `outputs.tf` — CDN IP, bucket URL, Cloud Run URL

### 1.3 Cloud Build Pipeline
Create `cloudbuild.yaml` that mirrors the GitHub Actions workflow:
```yaml
steps:
  - name: 'node:22'
    entrypoint: 'npm'
    args: ['ci']
  - name: 'node:22'
    entrypoint: 'npm'
    args: ['run', 'build']
  - name: 'gcr.io/cloud-builders/gsutil'
    args: ['-m', 'rsync', '-r', '-d', 'dist/', 'gs://hartzog-ai-website/']
```

---

## Phase 2: Dual Deployment (Transition Period)

Deploy to both GitHub Pages AND GCP simultaneously. Validate GCP serves
correctly before switching DNS.

### 2.1 Astro Config Changes
- Add `astro.config.gcp.mjs` for GCP-specific settings (same as current but
  can be extended for SSR adapter later)
- No changes to main `astro.config.mjs` — GitHub Pages still works

### 2.2 GitHub Actions: Dual Deploy
Update `.github/workflows/deploy.yml` to:
1. Build the site (existing)
2. Deploy to GitHub Pages (existing)
3. Deploy to Cloud Storage (new step, using `google-github-actions/upload-cloud-storage`)

### 2.3 DNS Preparation
- Set up Cloud DNS zone mirroring current DNS
- Create SSL certificate via Google-managed certificates
- Test with a staging subdomain (e.g., `staging.hartzog.ai`)

---

## Phase 3: DNS Cutover

### 3.1 Switch DNS
- Point `hartzog.ai` A/AAAA records to Cloud CDN IP
- Keep GitHub Pages as fallback (CNAME file stays in repo)
- Monitor for 48 hours

### 3.2 Update CDN URLs
- Update Web Component CDN references from jsDelivr to Cloud CDN
  (or keep jsDelivr — it works regardless of hosting)

---

## Phase 4: Server Services (When Needed)

Add backend capabilities without changing the static site architecture.

### 4.1 Cloud Run API
- Astro SSR adapter for server-rendered pages
- API endpoints for:
  - Contact form processing (replace Formspree)
  - Newsletter management (replace external service)
  - Analytics API (replace Plausible)
  - Authentication (client portal)

### 4.2 Database
- Firestore for: user accounts, form submissions, analytics events
- Cloud SQL (PostgreSQL) if relational data is needed later

### 4.3 Cloud Functions
- Lightweight serverless functions for:
  - Webhook receivers (Stripe, GitHub)
  - Scheduled tasks (report generation, data pipelines)
  - Image/PDF processing

### 4.4 AI/ML Services
- Vertex AI for custom model serving
- Cloud Functions + Vertex AI for on-demand analysis
- BigQuery for large-scale data analysis backing interactive articles

---

## Phase 5: Child Repo Migration

### 5.1 Multi-Site Cloud Storage
Each child repo gets its own Cloud Storage bucket:
```
gs://hartzog-ai-website/          → www.hartzog.ai
gs://hartzog-ai-<project>/       → www.hartzog.ai/<project>/ (or subdomain)
```

### 5.2 Update /init-project Skill
Add GCP deployment option to the skill:
- `cloudbuild.yaml` template
- Terraform module for per-project infrastructure
- Option to deploy as subdomain or path prefix

### 5.3 Shared Services
All child repos can call the central Cloud Run API for:
- Contact form submission
- Newsletter signup
- Analytics tracking
- Authentication (if needed)

---

## File Plan

New files to create in this repo:

```
infrastructure/
├── terraform/
│   ├── main.tf              # GCP provider, project config
│   ├── storage.tf           # Cloud Storage bucket
│   ├── cdn.tf               # Cloud CDN + Load Balancer + SSL
│   ├── dns.tf               # Cloud DNS zone
│   ├── cloudbuild.tf        # Cloud Build trigger
│   ├── cloudrun.tf          # Cloud Run service (future API)
│   ├── variables.tf         # Configurable settings
│   ├── outputs.tf           # Output values
│   ├── terraform.tfvars.example  # Example config
│   └── modules/
│       └── child-site/      # Reusable module for child repos
│           ├── main.tf
│           ├── variables.tf
│           └── outputs.tf
├── cloudbuild.yaml           # Cloud Build pipeline
└── README.md                 # Setup and migration guide

.github/workflows/deploy.yml  # Updated with dual-deploy step
.claude/skills/
├── gcp-deploy/SKILL.md       # Skill to manage GCP deployments
└── init-project/SKILL.md     # Updated with GCP option
```

---

## Cost Estimates

### Small (current traffic, just migrated)
| Service | Monthly Cost |
|---------|-------------|
| Cloud Storage (1GB) | ~$0.02 |
| Cloud CDN | ~$0.08/GB served |
| Cloud Build (free tier) | $0 |
| Cloud DNS | ~$0.20/zone |
| **Total** | **~$1-5/mo** |

### Medium (growing traffic, API added)
| Service | Monthly Cost |
|---------|-------------|
| Cloud Storage | ~$0.50 |
| Cloud CDN | ~$5 |
| Cloud Run (light API) | ~$5-15 |
| Firestore | ~$1-5 |
| **Total** | **~$15-30/mo** |

### Large (production business)
| Service | Monthly Cost |
|---------|-------------|
| Cloud Storage | ~$2 |
| Cloud CDN | ~$20 |
| Cloud Run (API + SSR) | ~$30-100 |
| Cloud SQL | ~$30-50 |
| Vertex AI | Usage-based |
| **Total** | **~$100-200+/mo** |

---

## Key Decisions

1. **Static-first**: Keep Astro static output as long as possible. Only add
   Cloud Run when server-side features are truly needed.
2. **Terraform**: Infrastructure-as-code from day one. Never manually configure.
3. **Dual deploy**: Overlap period ensures zero downtime during migration.
4. **Progressive**: Each phase is independent. Stop at any phase if current
   setup is sufficient.
5. **Portable Web Components**: The CDN-served Web Components work regardless
   of hosting — no migration needed for child repos.
