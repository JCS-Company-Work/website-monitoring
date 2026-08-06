/**
 * Syncs monitoring configuration received from WordPress.
 *
 * Handles creating and updating:
 * - sites
 * - categories
 * - tests
 */

const {
    findByWpId: findSiteByWpId,
    create: createSite
} = require('../db/queries/sites');

const {
    findByWpId: findCategoryByWpId,
    create: createCategory
} = require('../db/queries/categories');

const {
    findByWpId: findTestByWpId,
    create: createTest,
    updateTest
} = require('../db/queries/tests');

const { getNextRun } = require('../utils/schedule');


async function syncConfig(config) {

    const sites = {};

    const categories = {};


    // Sync tests and related data
    for (const test of config.tests ?? []) {


        /*
         * Sync site
         */
        let site = findSiteByWpId(
            test.site.id
        );


        if (!site) {

            const result = createSite({

                wp_site_id: test.site.id,

                slug: test.site.slug,

                name: test.site.name,

                url: test.site.url,

            });


            site = {
                id: result.lastInsertRowid
            };

        }


        sites[test.site.id] = site.id;



        /*
         * Sync category
         */
        let category = findCategoryByWpId(
            test.category.id
        );


        if (!category) {

            const result = createCategory({

                wp_category_id: test.category.id,

                slug: test.category.slug,

                name: test.category.name,

            });


            category = {
                id: result.lastInsertRowid
            };

        }


        categories[test.category.id] = category.id;



        /*
         * Sync test
         */
        const existing = findTestByWpId(
            test.id
        );


        const data = {

            wp_test_id: test.id,

            name: test.name,

            slug: test.slug,

            site_id: site.id,

            category_id: category.id,

            test_runner: test.runner,

            schedule: test.schedule,

            enabled: test.enabled ? 1 : 0,

            next_run_at: getNextRun(
                test.schedule
            )

        };


        if (!existing) {

            createTest(data);

        } else {

            updateTest(
                existing.id,
                data
            );

        }

    }

    return {
        success: true
    };

}

module.exports = {
    syncConfig
};