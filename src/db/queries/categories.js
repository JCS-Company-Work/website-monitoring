/**
 * Queries for the "categories" table.
 */

const db = require('../database');

/**
 * Finds category by WordPress ID.
 */
function findByWpId(wpCategoryId) {

    return db.prepare(`
        SELECT *
        FROM categories
        WHERE wp_category_id = ?
    `).get(wpCategoryId);

}

/**
 * Finds category by slug.
 */
function findBySlug(slug) {

    return db.prepare(`
        SELECT *
        FROM categories
        WHERE slug = ?
    `).get(slug);

}

/**
 * Creates a category.
 */
function create(category) {

    return db.prepare(`
        INSERT INTO categories (
            wp_category_id,
            name,
            slug,
            description
        )
        VALUES (?, ?, ?, ?)
    `).run(
        category.wp_category_id,
        category.name,
        category.slug,
        category.description ?? null
    );

}


module.exports = {
    findByWpId,
    findBySlug,
    create
};