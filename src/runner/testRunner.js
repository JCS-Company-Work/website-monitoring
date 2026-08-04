const { spawn } = require('child_process');

/**
 * Runs the Playwright monitoring test suite.
 *
 * Uses spawn instead of exec so Playwright output is streamed
 * directly to the console while tests are running.
 *
 * @returns {Promise<void>}
 */
function runTests(file = null, slug) {

    return new Promise((resolve, reject) => {

        const args = [
            'playwright',
            'test'
        ];

        if (file) {
            args.push(file);
        }

        const child = spawn(
            'npx',
            args,
            {
                stdio: 'inherit',
                    env: {
                    ...process.env,
                    MONITORING_TEST_SLUG: slug
                }
            }
        );

        child.on('close', code => {

            if (code !== 0) {

                reject(
                    new Error(`Tests failed with code ${code}`)
                );

                return;

            }

            resolve();

        });

    });

}

module.exports = {
    runTests
};