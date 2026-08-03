const { spawn } = require('child_process');

/**
 * Runs the Playwright monitoring test suite.
 *
 * Uses spawn instead of exec so Playwright output is streamed
 * directly to the console while tests are running.
 *
 * @returns {Promise<void>}
 */
function runTests() {

    return new Promise((resolve, reject) => {

        const child = spawn(
            'npx',
            ['playwright', 'test'],
            {
                stdio: 'inherit'
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