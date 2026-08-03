// Pull in the database instance
const db = require('./database');

/**
 * Creates the initial monitoring database schema.
 */
db.exec(`

CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_id INTEGER,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    environment TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    file TEXT NOT NULL,
    type TEXT,
    enabled INTEGER DEFAULT 1,
    schedule TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_executions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at DATETIME,
    completed_at DATETIME,
    trigger TEXT,
    status TEXT
);

CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    execution_id INTEGER NOT NULL,
    test_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    duration INTEGER,
    error TEXT,
    screenshot TEXT,
    video TEXT,
    started_at DATETIME,
    completed_at DATETIME
);

CREATE TABLE IF NOT EXISTS failures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_result_id INTEGER NOT NULL,
    error_message TEXT,
    stack_trace TEXT,
    screenshot TEXT,
    video TEXT,
    occurrences INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_seen DATETIME,
    resolved_at DATETIME
);

`);

console.log('Database migrated');