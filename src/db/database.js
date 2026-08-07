
// Pull in sqLite
const Database = require('better-sqlite3');

// Pull in path module to resolve the database file path
const path = require('path');

// Define the path to the SQLite database file
const dbPath = path.join(__dirname, '../../database/monitoring.sqlite');

// Create a new instance of the Database classand connect to db file
const db = new Database(dbPath);

// Export db instance
module.exports = db;