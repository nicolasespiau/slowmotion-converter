# Slowmotion Converter

## Description

This project provides a watcher that watch a given folder and generate
a slowmotion copy of any video appearing in it with a name matching a given
pattern.

I developed this script to be able to have slow motion replays during sport
streaming I'm used to broadcast in my roller derby league Roller Derby Toulouse.

## How it works?

I use [OBS](https://obsproject.com/) and this software provides a functionality
that allows you to capture the last few seconds stored in a buffer
by hitting a hotkey (see [documentation](https://obsproject.com/forum/resources/obs-classic-how-to-use-the-replay-buffer.103/)).

It saves a video file in a specific folder according to your setup.

Slowmotion Converter watch this folder and generate a copy of the
freshly created replay with a different frame rate.

In OBS, I add a scene with a VLC source in which I put slow motion replay
created like that.

## How to use it?

### Prerequisites

#### Docker method

First build the image:

```shell
$ docker build -t local/slowmotion-converter .
```

Then you can either run the container using cli commands or a docker-compose file.

Personnaly I prefer the docker-compose method.

Create your `docker-compose.yml` in the root folder of this project:

```yml
version: '3.0'

services:
  slowmotion-converter:
    container_name: slowmotion-converter
    image: local/slowmotion-converter
    tty: true
    restart: always
    volumes:
      - ./:/var/www
      - /PATH/TO/REPLAYS/LOCAL/FOLDER/:/var/www/vids/
      - /PATH/WHERE/YOU/WANT/SLOMO/FILES/:/var/www/rendered/
```

Then simply run it:

```sh
$ docker-compose up
```

Your converter is now running and watching to a folder you mounted as a
volume.

Each time a replay will be saved in `/PATH/TO/REPLAYS/LOCAL/FOLDER/` on
you local machine, a slow motion version will be copied into `/PATH/WHERE/YOU/WANT/SLOMO/FILES/`.

You now only have to set up a VLC source in your replays scene in OBS.

#### Non virtual method

> !! This method has not been tested

Pre-requisites:
- nodeJS 11
- ffmpeg

Steps:
- Set up OBS to write replays into `/PATH/TO/slowmotion-converter/vids/`
- Run the watcher from its root folder: `node index.js`
