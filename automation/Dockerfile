# Dockerfile for Automation Tests
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

COPY package*.json ./
COPY automation/package*.json ./automation/

RUN npm install --workspace=automation && \
    npx playwright install --with-deps

COPY automation ./automation

CMD ["npm", "run", "test", "--workspace=automation"]
