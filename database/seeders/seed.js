/**
 * Seeds the monitoring database with development data.
 */

const db = require('./database');

const insertBrand = db.prepare(`
    INSERT INTO brands (name, slug)
    VALUES (?, ?)
`);

const insertSite = db.prepare(`
    INSERT INTO sites (
        brand_id,
        name,
        slug,
        url,
        environment
    )
    VALUES (?, ?, ?, ?, ?)
`);

const insertCategory = db.prepare(`
    INSERT INTO categories (
        name,
        slug,
        description
    )
    VALUES (?, ?, ?)
`);

const insertTest = db.prepare(`
    INSERT INTO tests (
        name,
        slug,
        site_id,
        category_id,
        test_runner,
        file,
        enabled,
        schedule,
        next_run_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const seed = db.transaction(() => {

    // Brand
    const brandId = insertBrand.run(
        'Tailor Made',
        'tailor-made'
    ).lastInsertRowid;


    // Site
    const siteId = insertSite.run(
        brandId,
        'TM Store',
        'tm-store',
        'https://store.tailormade.uk',
        'live'
    ).lastInsertRowid;


    // Categories
    const coreCategoryId = insertCategory.run(
        'Core',
        'core',
        'Core website functionality'
    ).lastInsertRowid;

    const ecommerceCategoryId = insertCategory.run(
        'Ecommerce',
        'ecommerce',
        'Customer shopping journeys'
    ).lastInsertRowid;

    /**
     * Get current timestamp in ISO format without milliseconds and timezone.
     * @returns {string} Current timestamp in ISO format without milliseconds and timezone.
     */
    function now() {
        return new Date()
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');
    }

    // Tests
    insertTest.run(
        'TM Checkout Flow',
        'tm-checkout-flow',
        siteId,
        ecommerceCategoryId,
        'playwright',
        'tests/tm-store/uptime.spec.js',
        1,
        '*/1 * * * *',
        now()
    );

});


seed();

console.log('Database seeded.');