FROM node:alpine
WORKDIR usr/src/app
COPY package*.json .
RUN npm ci
COPY . .
CMD ["nodemon", "server.js"]