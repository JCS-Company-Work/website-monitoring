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
function findByName(name, file) {
console.log(
    'Searching for test by name:',
    name,
    'and file:',
    file
);
    return db.prepare(`
        SELECT *
        FROM tests
        WHERE name = ?
        AND file = ?
    `).get(name, file);

}

module.exports = {
    findByName
};