FROM angular/ngcontainer:latest

COPY . .

RUN npm i
RUN npm  run build
