CREATE TABLE IF NOT EXISTS contact_submissions (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL,
  subject VARCHAR(50) NOT NULL,
  subject_label VARCHAR(120) NOT NULL,
  message MEDIUMTEXT NOT NULL,
  company VARCHAR(255) DEFAULT NULL,
  attachment_path VARCHAR(2048) DEFAULT NULL,
  attachment_name VARCHAR(255) DEFAULT NULL,
  attachment_mime VARCHAR(255) DEFAULT NULL,
  attachment_size BIGINT DEFAULT NULL,
  ip VARCHAR(64) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_contact_submissions_created_at (created_at),
  KEY idx_contact_submissions_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jobs (
  id CHAR(36) NOT NULL PRIMARY KEY,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(120) NOT NULL,
  location VARCHAR(120) NOT NULL,
  description MEDIUMTEXT NOT NULL,
  department VARCHAR(120) DEFAULT NULL,
  employment_type VARCHAR(80) DEFAULT NULL,
  status VARCHAR(20) NOT NULL,
  posted_at DATETIME NOT NULL,
  closed_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_jobs_slug (slug),
  KEY idx_jobs_status_posted_at (status, posted_at),
  KEY idx_jobs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news (
  id CHAR(36) NOT NULL PRIMARY KEY,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(180) NOT NULL,
  excerpt VARCHAR(600) NOT NULL,
  content MEDIUMTEXT NOT NULL,
  category VARCHAR(80) NOT NULL,
  author VARCHAR(120) NOT NULL,
  image VARCHAR(2048) NOT NULL,
  source_name VARCHAR(120) NOT NULL,
  source_url VARCHAR(2048) NOT NULL,
  source_url_hash CHAR(64) NOT NULL,
  source_published_at DATETIME NOT NULL,
  status VARCHAR(20) NOT NULL,
  published_at DATETIME DEFAULT NULL,
  archived_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_news_slug (slug),
  UNIQUE KEY uniq_news_source_url_hash (source_url_hash),
  KEY idx_news_status_published_at (status, published_at),
  KEY idx_news_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news_tags (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  news_id CHAR(36) NOT NULL,
  tag VARCHAR(40) NOT NULL,
  UNIQUE KEY uniq_news_tag (news_id, tag),
  KEY idx_news_tags_news_id (news_id),
  CONSTRAINT fk_news_tags_news FOREIGN KEY (news_id) REFERENCES news (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
