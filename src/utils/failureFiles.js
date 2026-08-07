/**
 * Creates predictable filenames for failure evidence.
 */

function timestamp() {

    return new Date()
        .toISOString()
        .replace(/[-:]/g, '')
        .replace('T', '-')
        .split('.')[0];

}


function filename(testId, slug, extension) {

    return `${testId}-${slug}.${extension}`;

}

module.exports = {
    filename
};