# -------------------------------------------------------------
# Builder
# -------------------------------------------------------------
FROM node:14-alpine AS builder
LABEL maintainer="Dennis Pfisterer, http://www.dennis-pfisterer.de"

# Copy everything and create workdir
WORKDIR /app
COPY package.json package-lock.json /app/

# Install  dependencies
RUN npm install --no-optional && npm cache clean --force

# Install app
COPY app/ app/
COPY web/ web/
COPY webpack.config.prod.js /app/

RUN npm run build

# -------------------------------------------------------------
# Final container image
# -------------------------------------------------------------
FROM node:14-alpine

WORKDIR /app

COPY config/ config/
COPY --from=builder /app/dist/frontend/ /app/dist/frontend/
COPY --from=builder /app/dist/backend/ /app/app/

# Debugging output
RUN find /app | grep -v node_modules

# set our node environment, either development or production
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# UDP and TCP
EXPOSE 53
EXPOSE 7777

ENTRYPOINT ["node", "app/server.js"]
CMD [""]
