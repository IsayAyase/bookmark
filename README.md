# Task Management Application

A full-stack Task Management web application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication (email/password) (working on reset...)
- Create, read, update, and delete tasks
- User-specific task isolation
- Responsive design (mobile + desktop)
- Modern UI with Tailwind CSS

## Technical Stack

- **Frontend**: Next.js 16.1.4 with TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Mandatory Design & Thinking Questions

### 1. Why did you choose Firebase or Supabase for this assignment? What factors would make you choose the other option in a real production system?

I chose Supabase because:

- I'm more comfortable with NoSQL (MongoDB), but I deliberately chose Supabase to gain hands-on experience with SQL/PostgreSQL. This assignment was a good opportunity to work with relational data and learn proper SQL patterns.
- Row-Level Security (RLS) policies in Postgres handle the "users can only see their own tasks" requirement elegantly at the database level, rather than handling it in application logic.
- It's open-source, so I'm learning skills that aren't locked to one vendor.

I'd choose the other option (Firebase) if:

- Building a mobile-first app where Firebase's native SDKs (iOS/Android) provide better DX
- Need real-time sync across devices with minimal setup (Firebase Realtime Database is incredibly simple)
- Team has zero SQL experience and speed-to-market is critical
- Heavy integration with Google ecosystem (Analytics, Cloud Functions, etc.)
- Project requirements are simple enough that Firestore's document model fits naturally without needing complex joins

### 2. If this app suddenly gets 10,000 active users, what are the first 3 problems or bottlenecks you expect, and how would you address them?

#### **Problem 1**: Database Query Performance

- **Issue**: Fetching all tasks for a user without indexes or pagination will slow down.

- **Fix**: Add database indexes on user_id, implement pagination (load 20 tasks at a time), add proper query optimization

#### **Problem 2**: Auth Rate Limiting

- **Issue**: Login/signup endpoints could be hammered, causing service degradation or costs
- **Fix**: Implement rate limiting on auth endpoints, add CAPTCHA for signup, use edge caching where possible

#### **Problem 3**: API Costs & Cold Starts

- **Issue**: Serverless functions (Vercel/Firebase) have cold starts; database read/write costs spike
- **Fix**: Move frequently accessed data to Redis/cache layer, batch operations where possible, optimize queries to reduce reads

### 3. One design or technical decision you made that you know is not ideal, but accepted due to time constraints.

Multiple gaps I accepted for time:

- No skeleton loading - Just using spinners instead of skeleton screens. Looks less polished when loading data. Should add: Skeleton components that match the actual layout.
- Basic caching - Cache might show old data if someone updates tasks from another device. Should add: Proper cache invalidation using React Query or similar.
- No password reset - Users can't recover their account if they forget their password. Should add: Email-based password reset flow.

#### 4. How would you modify the system if:

**a) Supabase is removed**

- Set up own PostgreSQL database (Neon, Railway, or self-hosted)
- Build custom API routes in Next.js for auth and CRUD
- Use bcrypt to hash passwords, JWT for sessions
- Use Prisma or Drizzle ORM to talk to the database
- Handle user permissions in API middleware instead of RLS

**b) Role-based access is introduced (Admin, User, Guest)**

- Add role column to users table
- Update RLS policies to check role (admins see all tasks, users see only theirs)
- Add middleware to block actions based on role
- Create admin page to manage users and their roles
- Guests (if there) can only view, not create or delete

**c) Activity/audit logs are required**

- Create audit_logs table: user_id, action, task_id, timestamp, details
- Log every create/update/delete ops on request
- Store what changed (old value → new value)
- Add admin page to view logs and filter by user/date
- Auto-delete old logs after 90 days to save space

## Getting Started

First, run the development server:

```bash
npm run dev
```

or

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
