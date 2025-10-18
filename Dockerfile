FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production
COPY . .
ENV NODE_ENV=production
ENV DB_PATH=/data/products.db
RUN mkdir -p /data
EXPOSE 8000
CMD ["node", "server.js"]
