---
name: list-projects
description: List all projects linked in the Hartzog.ai ecosystem
disable-model-invocation: true
---

# List Linked Projects

Read `src/theme/sites.json` in this repository and display all registered projects in a clean table format:

| # | Name | URL | Repo | Primary |
|---|------|-----|------|---------|

Also show:
- Total number of linked projects
- Which ones have the `primary` flag
- A reminder that new projects can be added with `/link-project <repo-name>`
