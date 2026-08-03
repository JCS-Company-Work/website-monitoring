/**
 * Queries for the "categories" table.
 */
const db = require('../database');

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
            name,
            slug,
            description
        )
        VALUES (?, ?, ?)
    `).run(
        category.name,
        category.slug,
        category.description
    );

}

module.exports = {
    findBySlug,
    create
};