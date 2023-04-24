# Base image
FROM node:latest

# Set working directory
WORKDIR /api

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app to the working directory
COPY . .

# Build the api
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
RUN chmod +x startup.sh
RUN npm i -g sequelize-cli
ENTRYPOINT [ "./startup.sh" ]