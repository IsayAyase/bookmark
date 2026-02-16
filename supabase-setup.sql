-- Supabase Database Schema for Bookmark Manager
-- Run these commands in your Supabase SQL editor

-- Enable realtime for bookmarks table
BEGIN;
  -- Create bookmarks table
  CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
  CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at);

  -- Enable Row Level Security
  ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

  -- Create RLS policies
  CREATE POLICY "Users can view own bookmarks" ON bookmarks
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert own bookmarks" ON bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete own bookmarks" ON bookmarks
    FOR DELETE USING (auth.uid() = user_id);

  -- Enable realtime for bookmarks table
  ALTER TABLE bookmarks REPLICA IDENTITY FULL;
  ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
COMMIT;
