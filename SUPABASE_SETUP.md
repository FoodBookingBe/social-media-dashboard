# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in with your account
3. Click **New Project**
4. Fill in the details:
   - **Project Name**: `social-media-dashboard`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Select the closest region to your users
5. Click **Create New Project** and wait for it to finish (5-10 minutes)

## Step 2: Get Your API Keys

Once the project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under `ANON_PUBLIC`)
   - **Anon/Public Key** (under `ANON_PUBLIC`)
3. Store these securely for the next step

## Step 3: Set Environment Variables

In `frontend/.env.local` (create if it doesn't exist), add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace `your-project-id` and `your-anon-key-here` with your actual values from Step 2.

## Step 4: Execute Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `database/schema.sql` from your project
4. Paste it into the SQL Editor
5. Click **Run**
6. Wait for all tables to be created (you should see green checkmarks)

## Step 5: Verify the Setup

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - `social_media_posts`
   - `engagement_metrics`
   - `ai_generated_content`
   - `alerts`
   - `reviews`
   - `predictive_models`
   - `competitors`
   - `brand_guidelines`
   - `ab_tests`
   - `events`
   - `weather_data`

## Step 6: Test Connection

In the terminal, run:

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` and check the browser console for any Supabase errors.

## Troubleshooting

### "Invalid API key"
- Check that your keys are correctly copied in `.env.local`
- Make sure there are no extra spaces or line breaks

### "Database schema not found"
- Verify all SQL from `database/schema.sql` was executed
- Check the **Table Editor** to see which tables exist

### "Service not available"
- Wait a few minutes - Supabase might still be provisioning
- Check your region selection

## Next Steps

Once this is done, the application will:
1. ✅ Fetch real analytics from the database
2. ✅ Display real alerts and reviews
3. ✅ Store AI-generated content
4. ✅ Track engagement metrics
5. ✅ Generate predictive insights

You can then proceed to configure social media API integrations and AI models.

You can then proceed to configure social media API integrations and AI models.
