FROM node:16.8.0
WORKDIR /usr/app
COPY package.json .
RUN yarn install --silent
COPY . .
