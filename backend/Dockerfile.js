# Use the official Node.js runtime as the base image
FROM node:16

# Set the correct working directory
WORKDIR /NETFLIX-project/backend

# Copy package.json and package-lock.json first (for caching)
COPY backend/package*.json ./

# Run npm install before copying the rest of the app
RUN npm install

# Copy the rest of the backend source code
COPY backend/. .

# Expose the port your app uses (3000 in this case)
EXPOSE 3000

# Run the Node application (assuming main file is `app.js`)
CMD ["node", "src/app.js"]