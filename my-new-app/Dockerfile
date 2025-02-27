# Stage 1: Build the React app
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire app source
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the React app
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install `serve` globally
RUN npm install -g serve

# Copy the build output from the previous stage
COPY --from=builder /app/build ./build

# Expose port 3001
EXPOSE 3001

# Serve the React app
CMD ["serve", "-s", "build", "-l", "3001"]