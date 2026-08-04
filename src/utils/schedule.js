const { CronExpressionParser } = require('cron-parser');

/**
 * Calculates the next run time from a cron expression.
 *
 * @param {string} schedule
 * @returns {string}
 */
function getNextRun(schedule) {

    const interval = CronExpressionParser.parse(schedule);

    return interval.next()
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

}

module.exports = {
    getNextRun
};