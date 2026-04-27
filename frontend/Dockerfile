FROM node:alpine

LABEL authors="yaroslavmakogon"

WORKDIR /usr/src/app

COPY ./hits/ /usr/src/app

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0"]