FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S brewfather -u 1001

RUN chown -R brewfather:nodejs /app
USER brewfather

EXPOSE 3000


CMD ["npm", "start"]
