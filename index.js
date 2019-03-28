'use strict';

const FS = require('fs'),
  Path = require('path'),
  spawnSync = require('child_process').spawnSync,
  Events = require('events');

const EventHandler = new Events();
const config = require('./config/config');

FS.watch(config.dirToWatch, (eventType, filename) => {
  console.log(eventType, filename);

  if (eventType === "rename" && config.filePattern.test(filename) && FS.existsSync(Path.join(config.dirToWatch, filename))) {
    console.time("fullprocess");
    console.time("cut");
    const cutFilename = cut(filename);
    console.timeEnd("cut");
    console.time("framerate");
    const framerate = getFramerate(cutFilename);
    console.timeEnd("framerate");
    console.time("convert");
    const slowmoFilename = convert(cutFilename, framerate);
    console.timeEnd("convert");
    console.time("cleanFiles");
    const ts = new Date().toISOString().replace(/[\D]/g, '');
    //copy original file
    const tsNomoFilename = filename.replace(/(.+)\.([\d\w]+)/, '$1_'+ts+'.$2');
    FS.copyFileSync(Path.join(config.dirToWatch, filename), Path.join(config.nomoDir, tsNomoFilename));
    //move original file to archive
    FS.renameSync(Path.join(config.dirToWatch, filename), Path.join(config.archiveDir, filename.replace(/(.+)\.([\d\w]+)/, '$1_'+ts+'.$2')));
    //move cut file to archive
    FS.renameSync(Path.join(config.destDir, cutFilename), Path.join(config.archiveDir, cutFilename.replace(/(.+)\.([\d\w]+)/, '$1_'+ts+'.$2')));
    //copy slow mo file
    const tsSlomoFilename = slowmoFilename.replace(/(.+)\.([\d\w]+)/, '$1_'+ts+'.$2');
    FS.copyFileSync(Path.join(config.slomoDir, slowmoFilename), Path.join(config.archiveDir, tsSlomoFilename));
    console.timeEnd("cleanFiles");
    console.timeEnd("fullprocess");
  }
});

function getFramerate(filename) {
  const spawnRes = spawnSync("exiftool", [Path.join(config.destDir, filename)]);
  const videoInfo = spawnRes.stdout;
  return (/Video Frame Rate *: *([\d\.]+)/gi.exec(videoInfo))[1];
}

function convert(filename, frameRate) {
  const slowmoFilename = filename.replace(/(.+)\.([\d\w]+)/, '$1_slomo.$2');
  spawnSync("ffmpeg", ["-i", Path.join(config.destDir, filename), "-vf", `setpts=${1 / config.frFactor}*PTS`, "-r", (1 / config.frFactor) * frameRate, Path.join(config.slomoDir, slowmoFilename), "-y"]);
  return slowmoFilename;
}

function cut(input) {
  const output = input.replace(/(.+)\.([\d\w]+)/, 'replay_cut.$2');
  spawnSync("ffmpeg", ["-sseof", "-"+config.secondsToKeep, "-y", "-i", Path.join(config.dirToWatch, input), "-an", Path.join(config.destDir, output)]);
  return output;
}
