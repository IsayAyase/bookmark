# Bookmark Manager Application

A full-stack Bookmark Manager web application built with Next.js, TypeScript, and Supabase. Save and organize your favorite links with real-time sync across devices.

## Features

- **Google OAuth Authentication** - Secure login with Google accounts
- **Add Bookmarks** - Save URLs with custom titles
- **Private Bookmarks** - Each user can only see their own bookmarks (Row-Level Security)
- **Real-time Sync** - Changes appear instantly across all open tabs using Supabase Realtime
- **Delete Bookmarks** - Remove bookmarks you no longer need
- **Search** - Find bookmarks by title or URL
- **Responsive Design** - Works on mobile and desktop

## Technical Stack

- **Frontend**: Next.js 16.1.4 with TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Real-time**: Supabase Realtime (PostgreSQL logical replication + WebSocket)
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Vercel

## Architecture Highlights

### Real-time Sync Without WebSocket Server
Unlike traditional WebSocket implementations that require a persistent server, this app uses **Supabase Realtime**:
- PostgreSQL logical replication tracks database changes
- Supabase broadcasts changes via WebSocket to all connected clients
- No custom server code needed - works perfectly on Vercel's serverless platform
- Changes sync across browser tabs instantly

### Security
- **Row-Level Security (RLS)** - Database-level enforcement ensures users can only access their own bookmarks
- **Google OAuth** - No passwords stored, secure authentication flow

## Mandatory Design & Thinking Questions

### 1. Why did you choose Supabase for this assignment? What factors would make you choose the other option in a real production system?

I chose Supabase because:

- I'm more comfortable with NoSQL (MongoDB), but I deliberately chose Supabase to gain hands-on experience with SQL/PostgreSQL. This assignment was a good opportunity to work with relational data and learn proper SQL patterns.
- Row-Level Security (RLS) policies in Postgres handle the "users can only see their own bookmarks" requirement elegantly at the database level, rather than handling it in application logic.
- Supabase Realtime provides production-ready real-time sync out of the box - no need to build and maintain a WebSocket server.
- It's open-source, so I'm learning skills that aren't locked to one vendor.

I'd consider alternatives if:

- Building a mobile-first app where Firebase's native SDKs (iOS/Android) provide better DX
- Team has zero SQL experience and speed-to-market is critical
- Heavy integration with Google ecosystem (Analytics, Cloud Functions, etc.)
- Need complex offline sync capabilities (Firebase has better offline support)

### 2. If this app suddenly gets 10,000 active users, what are the first 3 problems or bottlenecks you expect, and how would you address them?

#### **Problem 1**: Database Connection Limits

- **Issue**: Supabase has connection limits (e.g., 60 concurrent on free tier). 10,000 active users could exhaust connections.
- **Fix**: 
  - Use connection pooling (PgBouncer) to reuse connections
  - Upgrade to Supabase Pro for higher limits
  - Implement request batching to reduce concurrent connections
  - Add Redis cache layer for frequently accessed data

#### **Problem 2**: Real-time Subscription Overload

- **Issue**: Each open tab maintains a WebSocket connection. 10,000 users with 2 tabs each = 20,000 connections.
- **Fix**:
  - Implement intelligent reconnection with exponential backoff
  - Batch updates instead of broadcasting individual changes
  - Consider moving to a dedicated real-time service (Ably, Pusher) for massive scale
  - Add client-side debouncing for rapid changes

#### **Problem 3**: Cold Starts on Vercel

- **Issue**: Serverless functions have cold starts; with 10,000 users, latency becomes noticeable.
- **Fix**:
  - Enable Vercel's Edge Functions for faster cold starts
  - Use Incremental Static Regeneration (ISR) for static pages
  - Implement proper caching strategies with SWR/React Query
  - Consider moving to a containerized solution (Railway, Render) for consistent performance

### 3. One design or technical decision you made that you know is not ideal, but accepted due to time constraints.

**No optimistic UI updates**: Currently, the UI waits for the database operation + real-time broadcast before showing the new bookmark. This creates a slight delay.

**Better approach**: Implement optimistic updates where the UI shows the bookmark immediately, then rolls back if the operation fails. This requires:
- Client-side state management for pending operations
- Error handling to revert optimistic state
- Conflict resolution if multiple tabs make changes simultaneously

Other gaps accepted:
- No skeleton loading - Just using spinners instead of skeleton screens
- No URL metadata fetching (title, favicon, preview image) - Would require a backend service to scrape URLs
- No bookmark folders/tags for organization

#### 4. How would you modify the system if:

**a) Supabase is removed**

- Set up own PostgreSQL database (Neon, Railway, or self-hosted)
- Build custom API routes in Next.js for auth and CRUD
- Use NextAuth.js for Google OAuth integration
- Implement own real-time solution using Socket.io or Server-Sent Events (requires persistent server, so move off Vercel)
- Use Prisma or Drizzle ORM to talk to the database
- Handle user permissions in API middleware instead of RLS

**b) Role-based access is introduced (Admin, User, Guest)**

- Add role column to users table
- Update RLS policies to check role (admins see all bookmarks, users see only theirs)
- Add middleware to block actions based on role
- Create admin page to view all users' bookmarks
- Guests can only view public bookmarks (add visibility column: public/private)
- Add bookmark sharing functionality

**c) Activity/audit logs are required**

- Create audit_logs table: user_id, action, bookmark_id, timestamp, details
- Log every create/delete operation via database triggers (efficient, can't be bypassed)
- Store what changed (old value → new value)
- Add admin page to view logs and filter by user/date
- Auto-delete old logs after 90 days to save space
- Export logs to external system (Datadog, Splunk) for long-term storage

## Database Schema

Run the SQL in `supabase-setup.sql` to create:

- `bookmarks` table with user isolation
- Row-Level Security policies
- Real-time publication for live sync

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Configure Google OAuth in Supabase Dashboard (Authentication → Providers → Google)
5. Run the SQL setup in your Supabase SQL editor
6. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This app is optimized for Vercel deployment:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The real-time features work out of the box on Vercel because Supabase handles the WebSocket connections, not Next.js.
