FROM angular/ngcontainer as build-stage

COPY package*.json ./

COPY . .

USER root

RUN npm install
RUN npm run test:ci
RUN npm run build

FROM nginx:1.15
COPY --from=build-stage ./dist/xlayers/ /usr/share/nginx/html

COPY --from=build-stage ./scripts/cloudbuild/ngcontainer/nginx.conf /etc/nginx/conf.d/default.conf