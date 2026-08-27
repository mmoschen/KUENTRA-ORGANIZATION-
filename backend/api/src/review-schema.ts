export const REVIEW_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY,
    display_name VARCHAR(80) NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(1000) NOT NULL,
    proof_filename VARCHAR(160),
    proof_mime_type VARCHAR(80),
    status VARCHAR(16) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    ip_hash CHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by VARCHAR(80)
  );

  CREATE INDEX IF NOT EXISTS reviews_status_created_at_idx ON reviews (status, created_at DESC);
  CREATE INDEX IF NOT EXISTS reviews_ip_hash_created_at_idx ON reviews (ip_hash, created_at DESC);
`;
