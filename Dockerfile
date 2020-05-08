FROM node:14-alpine
LABEL maintainer="Dennis Pfisterer, http://www.dennis-pfisterer.de"

# Copy everything and create workdir
COPY package.json package-lock.json /app/

# Install  dependencies
WORKDIR /app
RUN npm install --no-optional && npm cache clean --force

# Install app
COPY app/ app/
COPY config/ config/
COPY web/ web/
COPY webpack.config.prod.js /app/

RUN npm run build

FROM node:14-alpine

WORKDIR /app

COPY --from=0 /app/node_modules/ /app/node_modules/
COPY --from=0 /app/dist/frontend/ /app/dist/frontend/
COPY --from=0 /app/dist/backend/ /app/app/

RUN find /app | grep -v node_modules



# set our node environment, either development or production
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# UDP and TCP
EXPOSE 53
EXPOSE 7777

ENTRYPOINT ["node", "app/server.js"]
CMD [""]
