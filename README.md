# Task Management Application

A full-stack Task Management web application built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- User authentication (email/password)
- Create, read, update, and delete tasks
- User-specific task isolation
- Responsive design (mobile + desktop)
- Real-time updates
- Modern UI with Tailwind CSS

## 🛠 Technical Stack

- **Frontend**: Next.js 16.1.4 with TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Firebase/Supabase
- **Authentication**: Firebase Auth/Supabase Auth
- **Deployment**: Vercel/Firebase/Supabase

## 📋 Mandatory Design & Thinking Questions

### 1. Why did you choose Firebase or Supabase for this assignment?

For this assignment, I would choose **Supabase** for the following reasons:

- **PostgreSQL Foundation**: Supabase uses PostgreSQL, which provides superior SQL capabilities, complex queries, and better data integrity compared to Firebase's NoSQL Firestore
- **Open Source**: Being open-source provides more transparency, community contributions, and potential for self-hosting
- **Built-in Authentication**: Supabase Auth is comprehensive and integrates seamlessly with the database
- **REST API Generation**: Automatic REST API generation from database schema reduces development time
- **Real-time Capabilities**: Built-in real-time subscriptions without additional configuration
- **Better TypeScript Support**: Native TypeScript support with auto-generated types

### 2. What factors would make you choose the other option in a real production system?

I would choose **Firebase** in these scenarios:

- **Google Cloud Ecosystem**: If the organization heavily uses Google Cloud services, Firebase provides seamless integration
- **Mobile-First Applications**: Firebase has superior mobile SDKs and offline capabilities
- **Rapid Prototyping**: Firebase's real-time database is simpler for quick iterations without complex schemas
- **Machine Learning Integration**: Firebase ML Kit provides ready-to-use ML capabilities
- **Existing Expertise**: If the team has extensive Firebase experience
- **Enterprise Support**: Google's enterprise support and SLA guarantees
- **Global Scaling**: Firebase's global CDN and edge locations for better performance worldwide

### 3. If this app suddenly gets 10,000 active users, what are the first 3 problems or bottlenecks you expect, and how would you address them?

#### **Problem 1: Database Query Performance**
- **Issue**: With 10,000 users creating multiple tasks, database queries would become slow, especially fetching user-specific tasks
- **Solution**: 
  - Implement proper database indexing on userId fields
  - Add pagination to limit result sets
  - Consider database read replicas for load distribution
  - Implement query optimization and caching strategies

#### **Problem 2: Authentication Service Overload**
- **Issue**: High concurrent login attempts and token validations would strain the authentication service
- **Solution**:
  - Implement session caching with Redis
  - Use JWT with appropriate expiration times
  - Add rate limiting to prevent brute force attacks
  - Consider load balancer for auth endpoints

#### **Problem 3: Real-time Update Scalability**
- **Issue**: Real-time subscriptions would create excessive WebSocket connections
- **Solution**:
  - Implement connection pooling
  - Use efficient update batching strategies
  - Consider moving to server-sent events (SSE) for certain updates
  - Implement smart reconnection logic with exponential backoff

### 4. One design or technical decision you made that you know is not ideal, but accepted due to time constraints.

**Decision**: Using client-side state management instead of a robust server-side caching layer.

**Why it's not ideal**: 
- Potential for stale data across multiple browser tabs
- Increased API calls for the same data
- No centralized cache invalidation strategy

**Time constraint justification**:
- Implementing Redis or similar caching solution requires additional infrastructure setup
- Server-side caching adds complexity to the deployment pipeline
- For a task management app with moderate usage, client-side state provides adequate user experience
- Can be incrementally improved post-launch based on actual usage patterns

### 5. How would you modify the system if:

#### **Firebase/Supabase is removed**

**Architecture Changes**:
- Implement custom PostgreSQL database with connection pooling
- Build REST API using Node.js/Express or Next.js API routes
- Implement JWT-based authentication with bcrypt for password hashing
- Use Prisma or similar ORM for database operations
- Set up session management with Redis
- Implement database migrations and backup strategies

**Code Structure**:
```
src/
├── api/
│   ├── auth/
│   ├── tasks/
│   └── middleware/
├── database/
│   ├── migrations/
│   └── seeds/
└── services/
    ├── auth.ts
    └── database.ts
```

#### **Role-based access is introduced**

**Database Schema Changes**:
```sql
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  permissions JSONB
);
```

**Implementation**:
- Add role middleware to API routes
- Implement permission checking decorators
- Create role management UI for admins
- Add row-level security policies
- Update authentication to include role claims in JWT tokens

**Code Changes**:
- Protected route wrappers with role checks
- Permission-based component visibility
- Audit logging for role changes
- Role hierarchy enforcement

#### **Activity/audit logs are required**

**Database Schema**:
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Implementation**:
- Middleware to log all CRUD operations
- Event-driven architecture for real-time logging
- Background job processing for log aggregation
- Log retention policies and archiving
- Searchable log interface for administrators
- Compliance features (GDPR, SOX)

**Technical Considerations**:
- Asynchronous logging to avoid performance impact
- Log encryption for sensitive data
- Immutable logs for forensic analysis
- Integration with SIEM systems

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Development Notes

This project is structured following Next.js 13+ App Router conventions with TypeScript for type safety and Tailwind CSS for styling.

## 🚀 Deployment

The application is designed to be deployed on Vercel for optimal Next.js performance, with database hosting on Supabase or Firebase.

## 📄 License

This project is licensed under the MIT License.
