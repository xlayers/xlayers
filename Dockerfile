# Stage 0, "build-stage", based on the official NgContainer docker image
FROM angular/ngcontainer:latest as build-stage

WORKDIR /xlayers

COPY package*.json /xlayers/
RUN npm install
COPY ./ /xlayers/

RUN npm run test:ci

RUN npm run build
