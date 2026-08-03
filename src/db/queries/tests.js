const db = require('../database');

/**
 * Finds a monitoring test by name.
 *
 * Used by the Playwright reporter to map a Playwright test
 * to its database test record.
 *
 * @param {string} name Test name
 * @returns {Object|undefined}
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