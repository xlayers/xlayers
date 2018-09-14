FROM nginx:1.15
COPY dist/xlayers/ /usr/share/nginx/html
COPY scripts/cloudbuild/ngcontainer/nginx.conf /etc/nginx/conf.d/default.conf