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
        site_id,
        category_id,
        name,
        file,
        type,
        schedule
    )
    VALUES (?, ?, ?, ?, ?, ?)
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


    // Tests
    insertTest.run(
        siteId,
        ecommerceCategoryId,
        'tm-checkout-flow',
        'tests/tm-store/uptime.spec.js',
        'checkout',
        '*/15 * * * *'
    );

});


seed();

console.log('Database seeded.');