const fs = require('fs');
const path = require('path');

const TESTS_PATH = path.join(
    __dirname,
    '../../tests'
);


/**
 * Finds Playwright monitoring tests.
 *
 * Only files ending .spec.js are considered.
 */
function availableTests() {

    const tests = [];

    scanDirectory(
        TESTS_PATH,
        tests
    );

    return tests;

}


/**
 * Recursively scans directory.
 */
function scanDirectory(dir, tests) {

    if (!fs.existsSync(dir)) {
        return;
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {

        const fullPath = path.join(
            dir,
            file
        );

        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {

            scanDirectory(
                fullPath,
                tests
            );

            continue;

        }


        if (!file.endsWith('.spec.js')) {
            continue;
        }


        tests.push({

            file: path.relative(
                process.cwd(),
                fullPath
            ),

                slug: 'tm-checkout-flow',
    name: 'TM Checkout Flow',
    description: 'Checks the customer checkout process',
    type: 'playwright'

        });

    }

}


module.exports = {
    availableTests
};