FROM node:10.4.1-alpine

ENV NPM_CONFIG_LOGLEVEL notice

# Install NPM packages
WORKDIR /app
ADD package*.json ./
RUN npm i
ADD . .

# Args to set into the build
ARG GRAPHQL
RUN GRAPHQL=$GRAPHQL npm run build

EXPOSE 3000

CMD npm run production
