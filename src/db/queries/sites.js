/**
 * Queries for the "sites" table.
 */
const db = require('../database');

/**
 * Finds a site by slug.
 */
function findBySlug(slug) {

    return db.prepare(`
        SELECT *
        FROM sites
        WHERE slug = ?
    `).get(slug);

}

/**
 * Creates a site.
 */
function create(site) {

    return db.prepare(`
        INSERT INTO sites (
            brand_id,
            name,
            slug,
            url,
            environment
        )
        VALUES (?, ?, ?, ?, ?)
    `).run(
        site.brandId,
        site.name,
        site.slug,
        site.url,
        site.environment
    );

}

module.exports = {
    findBySlug,
    create
};