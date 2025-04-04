/*
  # Add preview column to resources table

  1. Changes
    - Add `preview` column to `resources` table as JSONB to store link preview data
      - Used for storing metadata about links (e.g., video thumbnails, titles)
      - JSONB type allows flexible storage of preview data
    
  2. Security
    - No changes to existing RLS policies required
    - Preview data inherits existing row-level security
*/

ALTER TABLE resources ADD COLUMN IF NOT EXISTS preview JSONB;