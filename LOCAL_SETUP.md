# Local Development Setup Guide

## Prerequisites
- Node.js (v18 or later)
- npm or yarn package manager
- Git

## Setup Steps

### 1. Clone the Repository
```bash
git clone https://github.com/sunofsep1/datadungeon.git
cd datadungeon
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Key Improvements Needed

### Priority 1: Database Integration (Supabase)
- Currently using mock data
- Need to set up Supabase project
- Create database schema for:
  - Contacts
  - Properties/Listings
  - Pipeline deals
  - Calendar events

### Priority 2: Authentication
- No auth system currently
- Implement Supabase Auth
- Add login/signup pages
- Protect routes

### Priority 3: Calendar Fixes
- Calendar component needs debugging
- Connect to real database
- Add event CRUD operations

### Priority 4: Real Estate Features
- Property image uploads
- Document management
- Email integrations
- Reporting dashboard

## Recommended Next Steps
1. Set up Supabase project at supabase.com
2. Run database migrations
3. Configure authentication
4. Replace mock data with API calls
5. Test and debug calendar functionality
