FROM node:11-alpine

RUN apk update
RUN apk add ffmpeg exiftool

ADD ./ /var/www
WORKDIR /var/www

CMD ["node", "index.js"]
