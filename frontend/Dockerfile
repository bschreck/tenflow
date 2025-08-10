# Development stage
FROM node:22-alpine as development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Expose port for Vite dev server
EXPOSE 5173

# Default command for development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Production build stage
FROM node:22-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine as production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
