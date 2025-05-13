-- Create public bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-images'
  AND (OCTET_LENGTH(DECODE(SUBSTRING(name FROM '^[^/]+'), 'base64')) / 1024 / 1024) <= 5 -- Max 5MB
  AND REGEXP_MATCH(LOWER(name), '.*\.(jpg|jpeg|png|gif)$')
);

-- Policy: Allow public read access
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'chat-images');

-- Policy: Allow users to delete their own uploads
CREATE POLICY "Allow users to delete own uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-images'
  AND auth.uid() = owner
);

-- Policy: Allow users to update their own uploads
CREATE POLICY "Allow users to update own uploads"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'chat-images'
  AND auth.uid() = owner
)
WITH CHECK (
  bucket_id = 'chat-images'
  AND (OCTET_LENGTH(DECODE(SUBSTRING(name FROM '^[^/]+'), 'base64')) / 1024 / 1024) <= 5 -- Max 5MB
  AND REGEXP_MATCH(LOWER(name), '.*\.(jpg|jpeg|png|gif)$')
); 