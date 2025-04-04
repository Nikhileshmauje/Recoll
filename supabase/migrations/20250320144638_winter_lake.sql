/*
  # Create Resources Schema

  1. New Tables
    - `resources`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `tags` (text array)
      - `type` (text, not null)
      - `url` (text)
      - `created_at` (timestamp with time zone)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on resources table
    - Add policies for authenticated users to manage their own resources
*/

CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  tags text[] DEFAULT '{}',
  type text NOT NULL,
  url text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own resources"
  ON resources
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resources"
  ON resources
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resources"
  ON resources
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resources"
  ON resources
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);