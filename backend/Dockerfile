# Dockerfile for Backend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm install --workspace=backend

COPY backend ./backend

RUN npm run build --workspace=backend

EXPOSE 3000 3001

CMD ["npm", "start", "--workspace=backend"]
