# Based on https://github.com/angular/angular/blob/master/tools/ngcontainer/Dockerfile

FROM node:10.5 as build-stage

# See https://crbug.com/795759
RUN apt-get update && apt-get install -yq libgconf-2-4

# Install latest chrome dev package
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable ttf-freefont xvfb \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

###
# Fix up npm global installation
# See https://docs.npmjs.com/getting-started/fixing-npm-permissions
RUN mkdir ~/.npm-global \
    && npm config set prefix '~/.npm-global' \
    && echo "export PATH=~/.npm-global/bin:$PATH" >> ~/.profile

###
# This version of ChromeDriver works with the Chrome version included
# in the circleci/*-browsers base image above.
# This variable is intended to be used by passing it as an argument to
# "postinstall": "webdriver-manager update ..."
ENV CHROMEDRIVER_VERSION_ARG "--versions.chrome 2.41"

RUN npm install -g @angular/cli@latest

WORKDIR /xlayers