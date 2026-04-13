-- ============================================
-- DATABASE SETUP FOR MERN AUTH + CRUD PROJECT
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS mern_auth_db;

-- Use database
USE mern_auth_db;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('active','pending','completed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign key
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES (FOR PERFORMANCE)
-- ============================================

-- index for faster user-based queries
CREATE INDEX idx_user_id ON items(user_id);

-- index for login/email lookup
CREATE INDEX idx_email ON users(email);

-- index for filtering status
CREATE INDEX idx_status ON items(status);

-- ============================================
-- SAMPLE DATA (OPTIONAL - SAFE TO KEEP)
-- ============================================

-- Sample user (password: 123456 hashed example)
-- INSERT INTO users (name, email, phone, password)
-- VALUES ('Test User', 'test@mail.com', '9999999999', '$2a$10$examplehash');

-- Sample item
-- INSERT INTO items (user_id, title, description, status)
-- VALUES (1, 'Sample Task', 'This is a test task', 'active');