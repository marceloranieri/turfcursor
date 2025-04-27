# TL;DR (Full Version below)

Awesome — here’s the **compressed, top-tier "minimal README" version** you can also keep ready.

This one is optimized for people who *already know GitHub Actions* and *just need fast operational info* without any "storytelling."

---

# Turf App – GitHub Workflows

> GitHub Actions to automate Turf’s Supabase deployments and daily topic rotations.

---

## Workflows

- **Deploy Supabase Edge Functions** (`deploy-functions.yml`)  
  - Triggers: Push to `main` (changes in `lib/supabase/edge-functions/**`) or manual run
  - Secrets: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`

- **Daily Topic Refresh** (`refresh-topics.yml`)  
  - Triggers: Scheduled at 00:00 UTC or manual run
  - Secrets: `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`

---

## Setup

1. Go to **Settings** → **Secrets and variables** → **Actions**.
2. Add:
   - `SUPABASE_ACCESS_TOKEN`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_PROJECT_REF`
   - `SUPABASE_URL`

Secrets are injected via the `env` section in each workflow.

---

## Manual Run

- **Actions tab** → Select workflow → **Run workflow** → Choose branch → **Run**.

---

## Troubleshooting

- Check secrets configuration.
- Verify repository Action permissions.
- Review logs in the **Actions** tab.


# Turf App – GitHub Workflows (FULL VERSION)

> **Turf** is a social platform for daily topic-based discussions, powered by lightweight AI curation and ephemeral group chats.

This directory contains GitHub Actions workflows used to automate critical operations for Turf’s backend and infrastructure.

---

## 📋 Available Workflows

### 1. Deploy Supabase Edge Functions
- **File:** `deploy-functions.yml`

Automatically deploys updated Supabase Edge Functions when changes are pushed to `main`.

**Triggers:**
- Push to `main` branch affecting `lib/supabase/edge-functions/**`
- Manual trigger via GitHub Actions UI

**Required Secrets:**
- `SUPABASE_ACCESS_TOKEN`: Supabase access token
- `SUPABASE_PROJECT_REF`: Supabase project reference ID

---

### 2. Daily Topic Refresh
- **File:** `refresh-topics.yml`

Runs daily to refresh active debate topics for the next 24 hours.

**Triggers:**
- Scheduled run at 00:00 UTC
- Manual trigger via GitHub Actions UI

**Required Secrets:**
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `SUPABASE_URL`: Supabase project URL

---

## 🔐 Setting Up Secrets

To configure secrets for GitHub Actions:

1. Go to **Settings** → **Secrets and variables** → **Actions** in your repository.
2. Click **New repository secret** and add the following:
   - `SUPABASE_ACCESS_TOKEN`: Available in your Supabase account settings.
   - `SUPABASE_SERVICE_ROLE_KEY`: Found in your Supabase project settings.
   - `SUPABASE_PROJECT_REF`: Extracted from your Supabase project URL.
   - `SUPABASE_URL`: Full Supabase project URL (e.g., `https://your-project.supabase.co`).

**Note:**  
Workflows reference secrets via the `env` section to ensure secure, context-aware access during runtime.

---

## 🚀 Manually Running a Workflow

To manually execute a workflow:

1. Open the **Actions** tab in GitHub.
2. Select the workflow you want to run.
3. Click **Run workflow**.
4. Choose the branch (e.g., `main`) and click **Run workflow**.

---

## 📈 Monitoring and Logs

- Track workflow runs and view detailed logs in the **Actions** tab.
- GitHub automatically displays run status (success, failure, in progress) for each workflow execution.

---

## 🛠 Troubleshooting

If a workflow fails:

- Ensure all required secrets are correctly configured.
- Confirm workflows have the correct repository permissions under **Settings** → **Actions** → **General**.
- Review error logs in the **Actions** tab for stack traces or API failures.
- Double-check that your Supabase project credentials are valid and active.

---

## 🧠 Notes

- Workflows are designed for minimum maintenance.
- Secrets should be rotated periodically following security best practices.

---

