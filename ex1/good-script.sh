#!/bin/sh
ffmpeg -y -i $1 -vf scale=iw/4:ih/4 -q:v 5 -vframes 1 -update 1 $2
