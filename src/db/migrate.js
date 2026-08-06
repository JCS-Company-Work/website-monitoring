// Pull in the database instance
const db = require('./database');

// Enforce foreign key constraints
db.pragma('foreign_keys = ON');

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

    wp_site_id INTEGER NOT NULL UNIQUE,

    brand_id INTEGER,

    name TEXT NOT NULL,

    slug TEXT NOT NULL UNIQUE,

    url TEXT NOT NULL,

    environment TEXT NOT NULL,

    active INTEGER DEFAULT 1,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (brand_id)
        REFERENCES brands(id)
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    wp_category_id INTEGER NOT NULL UNIQUE,

    name TEXT NOT NULL,

    slug TEXT NOT NULL UNIQUE,

    description TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tests (

    -- Identity
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    wp_test_id INTEGER NOT NULL UNIQUE,

    name TEXT NOT NULL,

    slug TEXT NOT NULL UNIQUE,

    -- Relationships
    site_id INTEGER NOT NULL,

    category_id INTEGER NOT NULL,

    -- Test definition
    test_runner TEXT NOT NULL,

    file TEXT,

    -- Scheduling
    enabled INTEGER DEFAULT 1,

    schedule TEXT NOT NULL,

    last_run_at DATETIME,

    next_run_at DATETIME,

    -- Audit
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (site_id)
        REFERENCES sites(id),

    FOREIGN KEY (category_id)
        REFERENCES categories(id)

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

    completed_at DATETIME,

    FOREIGN KEY (execution_id)
        REFERENCES test_executions(id),

    FOREIGN KEY (test_id)
        REFERENCES tests(id)

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

    resolved_at DATETIME,

    FOREIGN KEY (test_result_id)
        REFERENCES test_results(id)

);

`);

console.log('Database migrated');