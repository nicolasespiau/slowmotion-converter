'use extract';

module.exports = {
    dirToWatch: "vids",
    destDir: "rendered",
    filePattern: /^replay.*/,
    frFactor: process.env.FR_FACTOR || 0.5
};
