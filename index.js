'use strict';

const FS = require('fs');
const Path = require('path');
const {spawn} = require('child_process');

const config = require('./config/config');

FS.watch(config.dirToWatch, (eventType, filename) => {
    if (eventType === "rename" && config.filePattern.test(filename)) {
        //get framerate
        const videoInfoProcess = spawn("exiftool", [Path.join(config.dirToWatch, filename)]);
        let videoInfo;
        let frameRate;
        let err;

        videoInfoProcess.stdout.on('data', data => {
            videoInfo += data;
        });

        videoInfoProcess.stderr.on('data', data => {
            err += data;
        });

        videoInfoProcess.on('close', () => {
            frameRate = (/Video Frame Rate *: *([\d\.]+)/gi.exec(videoInfo))[1];
            try {
                convert(filename, parseInt(frameRate));
            } catch (e) {
                process.stdout.write("ERR:", e);
            }
        });
    }
});

function convert(filename, frameRate) {
    console.log(Path.join(config.dirToWatch, filename));
    const videoConverting = spawn("ffmpeg", ["-i", Path.join(config.dirToWatch, filename), "-vf", `setpts=${1/config.frFactor}*PTS`, "-r", (1/config.frFactor)*frameRate, filename.replace(/(.+)\.([\d\w]+)/, Path.join(config.destDir, '$1_slomo.$2'))]);

    let conversionInfo;
    let err;

    videoConverting.stdout.on('data', data => {
        conversionInfo += data;
    });

    videoConverting.stderr.on('data', data => {
        err += data;
    });

    videoConverting.on('close', () => {
        console.log(`${filename} converted`);
    });
}
