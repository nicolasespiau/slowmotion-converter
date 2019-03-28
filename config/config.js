'use extract';

module.exports = {
  dirToWatch: process.env.DIR_TO_WATCH || "vids/input",
  destDir: process.env.DEST_DIR || "vids/rendered",
  slomoDir: process.env.SLOMO_DIR || "vids/rendered/slomo",
  nomoDir: process.env.NOMO_DIR || "vids/rendered/nomo",
  archiveDir: process.env.ARCHIVE_DIR || "vids/archives",
  filePattern: /^replay.*/,
  frFactor: process.env.FR_FACTOR || 0.5,
  secondsToKeep: process.env.SECONDS_TO_KEEP || 4
};
