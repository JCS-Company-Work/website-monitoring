// Pull in the database connection
const db = require('../database');

/**
 * Finds a test by its unique key.
 *
 * @param {string} name Test key
 * @returns {Object|null}
 */
function findByName(name) {

    return db.prepare(`
        SELECT *
        FROM tests
        WHERE name = ?
    `).get(name);

}


module.exports = {
    findByName
};