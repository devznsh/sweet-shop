FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
# NOTE: For production, run migrations using a separate init container or migration job
# to avoid race conditions in multi-instance deployments
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
