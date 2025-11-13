# GitHub Actions CI Setup (Manual)

## Problem
The GitHub PAT token used for pushes **lacks the `workflow` scope**, which prevents us from pushing `.github/workflows/*.yml` files directly via git.

**Solution**: Manually create the CI workflow in GitHub web UI (this has full permissions).

## Steps to Enable CI/CD on GitHub

### 1. Create `.github/workflows/ci.yml` in GitHub Web UI

1. Go to: https://github.com/FoodBookingBe/social-media-dashboard/new/main
   - Or navigate to `Code` → `.github/workflows/` → **Create new file**
2. Name: `ci.yml`
3. Paste the following YAML:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    - name: Install dependencies
      run: npm install
    - name: Build frontend
      run: npm run build

  test-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    - name: Install backend dependencies
      run: cd backend && npm install
    - name: Build backend
      run: cd backend && npm run build

  deploy:
    needs: [test-frontend, test-backend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm ci
    - name: Build (frontend)
      run: npm run build
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
        working-directory: 'frontend'
```

4. Commit message: `ci: add GitHub Actions CI workflow`
5. Click **Commit directly to the main branch**

### 2. Add GitHub Secrets

Go to: https://github.com/FoodBookingBe/social-media-dashboard/settings/secrets/actions

Add these secrets:
- **VERCEL_TOKEN** — Personal Vercel API token (with deploy permission)
- **VERCEL_ORG_ID** — Your Vercel organization ID
- **VERCEL_PROJECT_ID** — Your Vercel project ID
- **NEXT_PUBLIC_SUPABASE_URL** — Supabase project URL (https://your-project.supabase.co)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** — Supabase anon/public key
- **SUPABASE_SERVICE_ROLE_KEY** — Supabase service role key (server-only, not exposed to client)

### 3. Verify CI is Running

Go to: https://github.com/FoodBookingBe/social-media-dashboard/actions

You should see:
- ✅ `test-frontend` job (builds frontend)
- ✅ `test-backend` job (builds backend)
- ✅ `deploy` job (deploys to Vercel on main branch)

If any job fails, click on it to see logs.

## Troubleshooting

### Build fails with "ESLint errors"
→ This is expected; we've configured ESLint to treat most type-warnings as warnings (not errors) in `frontend/.eslintrc.json`. If lint still fails:
- Check `frontend/.eslintrc.json` has the `rules` section with warnings enabled.
- Run `npm run lint` locally to debug.

### Deploy job skipped
→ Deploy only runs on pushes to `main`. To test, push to main or create a PR and merge.

### Vercel deploy fails
→ Likely missing secrets. Check:
1. All three VERCEL_* secrets are set correctly in GitHub Secrets.
2. VERCEL_PROJECT_ID matches your actual Vercel project (go to Vercel project → Settings → General → Project ID).

### Supabase connection errors at runtime
→ Ensure NEXT_PUBLIC_SUPABASE_* secrets are set in both GitHub Secrets AND Vercel project environment variables.

## Next: Supabase Setup

See `DEPLOYMENT.md` for complete Supabase + Vercel setup instructions.
