# Supabase Setup Guide

This guide will walk you through setting up Supabase for your Real Estate CRM.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

## Step 2: Create a New Project

1. Click "New Project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: DataDungeon CRM (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location (e.g., Australia Southeast for Brisbane)
4. Click "Create new project"
5. Wait 2-3 minutes for project to initialize

## Step 3: Run the Database Schema

1. In your Supabase project dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql` from this repository
4. Paste it into the SQL editor
5. Click "Run" (or press Cmd+Enter / Ctrl+Enter)
6. You should see "Success. No rows returned" - this is normal!

## Step 4: Verify Tables Were Created

1. Click on "Table Editor" in the left sidebar
2. You should see these tables:
   - contacts
   - properties
   - deals
   - calendar_events
   - activities
3. Click on each table to verify they have the correct columns

## Step 5: Get Your API Keys

1. Click on "Settings" (gear icon) in the left sidebar
2. Click on "API" under Project Settings
3. You'll see two important values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJhbGci...`
4. Copy both values - you'll need them next

## Step 6: Configure Your Environment Variables

1. In your project root, create a `.env` file (copy from `.env.example`)
2. Add your Supabase credentials:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```
3. Make sure `.env` is in your `.gitignore` (it already is!)

## Step 7: Enable Email Authentication (Optional)

1. In Supabase dashboard, go to "Authentication" > "Providers"
2. Enable "Email" provider
3. Configure email templates if desired
4. For testing, you can disable email confirmation temporarily:
   - Go to "Authentication" > "Settings"
   - Uncheck "Enable email confirmations"

## Step 8: Test Your Connection

1. Start your development server: `npm run dev`
2. Try to sign up for a new account
3. Check if data appears in your Supabase tables

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the schema.sql script completely
- Check the SQL Editor for any error messages
- Verify tables exist in Table Editor

### Authentication not working
- Check that your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct
- Make sure you're using the "anon" key, not the "service_role" key
- Verify email provider is enabled in Authentication settings

### Data not showing up
- Open browser developer tools (F12)
- Check Console for errors
- Check Network tab for failed requests
- Verify Row Level Security policies are set correctly

## Next Steps

Once Supabase is configured:
1. Test user registration and login
2. Add some test contacts, properties, and deals
3. Test the calendar functionality
4. Configure email notifications (optional)
5. Set up storage for property images (optional)

## Useful Supabase Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Authentication Guide](https://supabase.com/docs/guides/auth)
