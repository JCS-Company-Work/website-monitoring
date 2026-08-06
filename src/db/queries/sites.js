/**
 * Queries for the "sites" table.
 */

const db = require('../database');

/**
 * Finds a site by WordPress ID.
 */
function findByWpId(wpSiteId) {

    return db.prepare(`
        SELECT *
        FROM sites
        WHERE wp_site_id = ?
    `).get(wpSiteId);

}

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
            wp_site_id,
            brand_id,
            name,
            slug,
            url,
            environment
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(
        site.wp_site_id,
        site.brand_id ?? null,
        site.name,
        site.slug,
        site.url,
        site.environment ?? 'production'
    );

}

module.exports = {
    findByWpId,
    findBySlug,
    create
};