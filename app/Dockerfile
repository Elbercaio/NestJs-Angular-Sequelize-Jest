# Base image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app to the working directory
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 4200

# Start the app
CMD ["npm", "start"]
