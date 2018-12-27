FROM node:10.11-alpine

ENV NPM_CONFIG_LOGLEVEL notice

# Install NPM packages
WORKDIR /app
ADD package*.json ./
RUN npm i
ADD . .

# Build
RUN npm run build

EXPOSE 3000

CMD npm run production
