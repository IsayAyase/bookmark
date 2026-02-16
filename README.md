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

## Challenges & Solutions

### Challenge: Real-time Sync on Serverless Platform
**Problem**: Vercel is serverless and doesn't support persistent WebSocket connections. Traditional real-time implementations (Socket.io) require a dedicated server, which isn't possible on Vercel's serverless architecture.

**Solution**: Used Supabase Realtime which handles WebSocket connections on Supabase's infrastructure, not Vercel's. The client connects directly to Supabase's realtime servers, completely bypassing the serverless limitation. This architecture allows real-time sync to work perfectly on Vercel without writing any server-side WebSocket code. The PostgreSQL logical replication feature tracks database changes and broadcasts them to all connected clients via WebSocket, enabling instant synchronization across browser tabs.

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
