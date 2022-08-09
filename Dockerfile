# Build
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Setup nginx
FROM nginx:1.21.6-alpine
COPY conf/default.conf /etc/nginx/conf.d/
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
