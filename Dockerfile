FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

# Copy backend source
COPY backend ./backend

# Create writable folders for uploaded / filled PDFs
RUN mkdir -p backend/uploads backend/filled

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "backend/server.js"]
