FROM node:12.2.0-alpine AS builder

# log most things
ENV NPM_CONFIG_LOGLEVEL notice

# OS packages for compilation
RUN apk add --no-cache python2 make g++

# install NPM packages
WORKDIR /build
ADD package*.json ./
RUN npm i

# add source
ADD . .

# build
RUN npm run build:production

########################

FROM node:12.2.0-alpine
WORKDIR /app

# copy source + compiled `node_modules` 
COPY --from=builder /build .

# by default, run in production mode
CMD npm run production