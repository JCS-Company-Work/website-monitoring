/**
 * Syncs monitoring configuration received from WordPress.
 *
 * Handles creating and updating:
 * - sites
 * - categories
 * - tests
 */

const {
    findBySlug: findSiteBySlug,
    create: createSite
} = require('../db/queries/sites');

const {
    findBySlug: findCategoryBySlug,
    create: createCategory
} = require('../db/queries/categories');

const {
    findBySlug: findTestBySlug,
    create: createTest
} = require('../db/queries/tests');


async function syncConfig(config) {

    const sites = {};
    const categories = {};

    // Sync sites
    for (const site of config.sites ?? []) {

        let record = findSiteBySlug(site.slug);

        if (!record) {

            const result = createSite(site);

            record = {
                id: result.lastInsertRowid
            };

        }

        sites[site.slug] = record.id;

    }


    // Sync categories
    for (const category of config.categories ?? []) {

        let record = findCategoryBySlug(category.slug);

        if (!record) {

            const result = createCategory(category);

            record = {
                id: result.lastInsertRowid
            };

        }

        categories[category.slug] = record.id;

    }


    // Sync tests
    for (const test of config.tests ?? []) {

        const existing = findTestBySlug(test.slug);

        if (!existing) {

            createTest({
                ...test,
                siteId: sites[test.site],
                categoryId: categories[test.category]
            });

        }

    }


    return {
        success: true
    };

}


module.exports = {
    syncConfig
};