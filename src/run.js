const { runTests } = require('./runner/testRunner');

runTests()
    .then(() => {
        console.log('Monitoring run complete');
    })
    .catch(error => {
        console.error('Monitoring run failed:', error.message);
        process.exit(1);
    });