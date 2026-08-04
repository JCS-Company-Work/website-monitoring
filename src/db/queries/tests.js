const db = require('../database');

/**
 * Finds a monitoring test by name and file.
 *
 * Used by the Playwright reporter to map a Playwright test
 * to its database test record.
 *
 * @param {string} name Test name
 * @param {string} file Test file path
 * @returns {Object|undefined}
 */
function findByName(name, file) {

    return db.prepare(`
        SELECT *
        FROM tests
        WHERE name = ?
        AND file = ?
    `).get(name, file);

}

/**
 * Finds a monitoring test by slug.
 *
 * Used by configuration sync from external systems.
 *
 * @param {string} slug Test identifier
 * @returns {Object|undefined}
 */
function findBySlug(slug) {

    return db.prepare(`
        SELECT *
        FROM tests
        WHERE slug = ?
    `).get(slug);

}


/**
 * Creates a new monitoring test.
 *
 * @param {Object} test Test details
 */
function create(test) {

    return db.prepare(`
        INSERT INTO tests (
            site_id,
            category_id,
            name,
            slug,
            test_runner,
            file,
            schedule,
            enabled,
            next_run_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        test.siteId,
        test.categoryId,
        test.name,
        test.slug,
        test.test_runner,
        test.file,
        test.schedule,
        test.enabled ? 1 : 0,
        test.nextRunAt
    );

}

/**
 * Updates an existing monitoring test.
 *
 * Used by configuration sync when a test already exists.
 * WordPress remains the source of truth for monitoring configuration.
 *
 * @param {number} id Test ID
 * @param {Object} test Test details
 * @returns {Object} Result of the update operation
 */
function updateTest(id, test) {

    return db.prepare(`
        UPDATE tests
        SET
            site_id = ?,
            category_id = ?,
            name = ?,
            slug = ?,
            test_runner = ?,
            file = ?,
            enabled = ?,
            schedule = ?,
            next_run_at = ?
        WHERE id = ?
    `).run(
        test.siteId,
        test.categoryId,
        test.name,
        test.slug,
        test.test_runner,
        test.file,
        test.enabled ? 1 : 0,
        test.schedule,
        test.nextRunAt,
        id
    );

}

/**
 * Updates the schedule of a monitoring test.
 *
 * Used after a worker execution to store the latest run
 * and calculate the next scheduled execution.
 *
 * @param {number} id Test ID
 * @param {string} lastRunAt Last run timestamp
 * @param {string} nextRunAt Next run timestamp
 * @returns {Object}
 */
function updateSchedule(id, lastRunAt, nextRunAt) {

    return db.prepare(`
        UPDATE tests
        SET last_run_at = ?,
            next_run_at = ?
        WHERE id = ?
    `).run(
        lastRunAt,
        nextRunAt,
        id
    );

}

module.exports = {
    findByName,
    findBySlug,
    create,
    updateTest,
    updateSchedule
};