---
name: unlink-project
description: Remove a project from the Hartzog.ai ecosystem registry
disable-model-invocation: true
argument-hint: "[repo-name]"
---

# Unlink a Project from Hartzog.ai

The user wants to remove: `$ARGUMENTS`

## Steps

1. Read `src/theme/sites.json`
2. Find the entry matching the repo name `$0`
3. If not found, show the current list and let the user pick
4. **Do NOT remove entries with `"primary": true`** — warn the user if they try
5. Remove the entry from the sites array
6. Save the updated `sites.json`
7. Remind the user to also remove `.hartzog.json` from the child repo if desired
8. Ask if they want to commit the change
