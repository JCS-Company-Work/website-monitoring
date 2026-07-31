/**
 * Removes ANSI terminal colour codes from text.
 *
 * @param {string|null} value Error message
 * @returns {string|null}
 */
function stripAnsi(value) {

    if (!value) {
        return null;
    }

    return value.replace(
        /\u001b\[[0-9;]*m/g,
        ''
    );

}

module.exports = {
    stripAnsi
};