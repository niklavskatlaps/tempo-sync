FROM node:16.8.0
WORKDIR /usr/app/client
COPY package.json yarn.lock ./
RUN yarn install --silent
COPY . .