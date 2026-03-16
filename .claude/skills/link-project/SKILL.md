---
name: link-project
description: Link a GitHub repo to the Hartzog.ai ecosystem. Adds it to sites.json, creates the .hartzog.json flag file, and sets up the shared theme in the child repo.
disable-model-invocation: true
argument-hint: "[repo-name] [optional: display-name] [optional: description]"
---

# Link a GitHub Pages Project to Hartzog.ai

You are linking a GitHub repository to the Hartzog.ai project ecosystem.

## Input

The user provides: `$ARGUMENTS`

Parse the arguments:
- **First argument ($0)**: GitHub repo name (e.g., `my-rust-project`). Required.
- **Second argument ($1)**: Display name (e.g., `"My Rust Project"`). Optional — infer from repo name if not given (title-case, replace hyphens with spaces).
- **Remaining arguments**: Description. Optional — ask the user if not given.

## Steps

### 1. Validate the repo exists

Check if the repo exists under the `timothyhartzog` GitHub account:

```bash
gh repo view timothyhartzog/$0 --json name,description,homepageUrl 2>/dev/null
```

If the repo doesn't exist, inform the user and ask if they want to proceed anyway (they may create it later).

### 2. Update sites.json

Read the current `src/theme/sites.json` in **this** repository (timothyhartzog.github.io).

Add a new entry to the `sites` array:

```json
{
  "name": "<display-name>",
  "url": "https://timothyhartzog.github.io/<repo-name>",
  "repo": "<repo-name>",
  "description": "<description>",
  "icon": "code"
}
```

**Important:**
- Do NOT set `"primary": true` — only the main site has that
- If the repo already has a custom domain, use that instead of the github.io URL
- Do not add duplicates — check if the repo is already registered

### 3. Create .hartzog.json flag file for the child repo

Create the file at a temporary location so the user can copy it, OR if the child repo is cloned locally (check common paths like `~/<repo-name>` or sibling directories), write it directly.

The flag file contents:

```json
{
  "parent": "https://www.hartzog.dev",
  "theme": true,
  "name": "<display-name>",
  "description": "<description>"
}
```

### 4. Generate the child repo's index.html (if the repo is empty or has no index.html)

If you have access to the child repo locally, create an `index.html` using the template from `templates/child-repo/index.html` in this repo. Update:
- The `<title>` tag with the project name
- The `<h1>` with the project name
- The description paragraph

### 5. Show the user a summary

Display what was done:

```
Linked: <repo-name> → Hartzog.ai ecosystem

sites.json: Added "<display-name>" (https://timothyhartzog.github.io/<repo-name>)
Flag file:  .hartzog.json created
Theme:      Shared nav/footer/colors via CDN

Next steps:
1. Copy .hartzog.json to the root of <repo-name> (if not done automatically)
2. Commit and push changes in both repos
3. The project will appear on hartzog.dev/projects and in the nav dropdown
```

### 6. Offer to commit

Ask the user if they want to commit the sites.json change in this repo.
