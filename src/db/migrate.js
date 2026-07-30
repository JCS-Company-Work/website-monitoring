// Pull in the database instance
const db = require('./database');

// Create the test_runs table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS test_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_name TEXT NOT NULL,
    file TEXT,
    status TEXT NOT NULL,
    duration INTEGER,
    error TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('Database migrated');