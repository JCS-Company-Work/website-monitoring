/**
 * Seeds the monitoring database with development data.
 */

const db = require('./database');

const insertBrand = db.prepare(`
    INSERT INTO brands (name, slug)
    VALUES (?, ?)
`);

const insertSite = db.prepare(`
    INSERT INTO sites (brand_id, name, url, environment)
    VALUES (?, ?, ?, ?)
`);

const insertCategory = db.prepare(`
    INSERT INTO categories (name, description)
    VALUES (?, ?)
`);

const insertTest = db.prepare(`
    INSERT INTO tests (
        site_id,
        category_id,
        name,
        type,
        schedule
    )
    VALUES (?, ?, ?, ?, ?)
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
        'https://store.tailormade.uk',
        'live'
    ).lastInsertRowid;


    // Categories
    const coreCategoryId = insertCategory.run(
        'Core',
        'Core website functionality'
    ).lastInsertRowid;

    const ecommerceCategoryId = insertCategory.run(
        'Ecommerce',
        'Customer shopping journeys'
    ).lastInsertRowid;


    // Tests
    insertTest.run(
        siteId,
        ecommerceCategoryId,
        'tm-checkout-flow',
        'checkout',
        '*/15 * * * *'
    );

});


seed();

console.log('Database seeded.');