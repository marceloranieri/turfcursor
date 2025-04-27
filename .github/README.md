# 📦 Turf App – GitHub Workflows

> GitHub Actions powering Turf’s backend automation: Supabase deployments and daily topic rotations.

This directory contains Turf’s production-ready GitHub Actions to ensure reliability, scalability, and minimal manual intervention.

---

## 🚀 Workflows

### 1. Deploy Supabase Edge Functions
- **File:** `deploy-functions.yml`
- **Triggers:**
  - Push to `main` branch (`lib/supabase/edge-functions/**`)
  - Manual run via GitHub Actions UI
- **Required Secrets:**
  - `SUPABASE_ACCESS_TOKEN`
  - `SUPABASE_PROJECT_REF`

### 2. Daily Topic Refresh
- **File:** `refresh-topics.yml`
- **Triggers:**
  - Scheduled daily at 00:00 UTC
  - Manual run via GitHub Actions UI
- **Required Secrets:**
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_URL`

---

## 🔐 Secrets Configuration

Add the required secrets to your GitHub repository:

1. Navigate to **Settings** → **Secrets and variables** → **Actions**.
2. Create the following secrets:
   - `SUPABASE_ACCESS_TOKEN` — from Supabase account settings
   - `SUPABASE_SERVICE_ROLE_KEY` — from Supabase project settings
   - `SUPABASE_PROJECT_REF` — from Supabase project URL
   - `SUPABASE_URL` — full project URL (e.g., `https://your-project.supabase.co`)

Secrets are securely injected via each workflow’s `env` section.

---

## 🧑‍💻 Manual Workflow Execution

1. Open the **Actions** tab.
2. Select the workflow.
3. Click **Run workflow**.
4. Choose the branch (e.g., `main`) and run.

---

## 📈 Monitoring & Logs

- Monitor workflow statuses and logs directly in the **Actions** tab.
- Use logs for detailed debugging in case of failures.

---

## 🛠 Troubleshooting

- Ensure all required secrets are correctly configured.
- Confirm repository Actions permissions are enabled.
- Review full error logs in the **Actions** tab.
- Verify that Supabase tokens are valid and active.

---

## 🧠 Best Practices

- Rotate secrets periodically for security.
- Test manual runs after major dependency or permission updates.
- Monitor GitHub Actions permission updates and Supabase API changes.
