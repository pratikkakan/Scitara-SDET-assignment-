# Dockerfile for Frontend
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/

RUN npm install --workspace=frontend

COPY frontend ./frontend

RUN npm run build --workspace=frontend

FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 5173

CMD ["serve", "-s", "frontend/dist", "-l", "5173"]
