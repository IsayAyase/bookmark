# Supabase Environment Variables Setup Guide

## Required Environment Variables

For Next.js client-side usage, you need these **minimum** variables:

```bash
# Copy this to your .env.local file
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Where to get these keys from Supabase:

1. **Go to your Supabase Project**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to Settings → API**
4. **You will find these keys:**
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: Optional, for server-side admin operations

## Complete Environment Variables (Optional)

For advanced usage, you can also add:

```bash
# For server-side admin operations (optional)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Alternative key name that some Supabase versions use
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_default_key
```

## Update Your .env.local

```bash
# Replace with your actual Supabase project details
NEXT_PUBLIC_SUPABASE_URL=https://your-unique-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlYW4iOiJzdXBhYmFzZSIsInVybGVzIjoicmVhYiJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlYW4iOiJzdXBhYmFzZSIsInVybGVzIjoicmVhYiJ9...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlYW4iOiJzdXBhYmFzZSIsInVybGVzIjoicmVhYiJ9...
```

## Important Notes:

1. **NEXT_PUBLIC_ prefix** is required for client-side access in Next.js
2. **ANON_KEY** is safe for client-side usage - has limited permissions
3. **SERVICE_ROLE_KEY** should ONLY be used on server-side, never expose to client
4. **Never commit actual keys** to version control

## Quick Setup Commands:

```bash
# Copy the template
cp .env.example .env.local

# Edit with your actual Supabase details
nano .env.local

# Verify the app works
npm run dev
```