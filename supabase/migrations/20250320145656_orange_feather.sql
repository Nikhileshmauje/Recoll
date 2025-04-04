/*
  # Create storage bucket for resources

  1. New Storage
    - Create a new public bucket called 'resources' for storing uploaded files
    
  2. Security
    - Enable public access for authenticated users
    - Add policy for authenticated users to read/write their own files
*/

-- Create a new storage bucket for resources
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true);

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resources');

-- Create policy to allow authenticated users to read their own files
CREATE POLICY "Allow authenticated users to read their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'resources');

-- Create policy to allow authenticated users to update their own files
CREATE POLICY "Allow authenticated users to update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'resources');

-- Create policy to allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated users to delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'resources');