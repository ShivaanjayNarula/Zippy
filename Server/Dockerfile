# Use an official Node.js runtime as the base image
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
# This allows Docker to cache the npm install step if only source code changes
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port your application listens on
EXPOSE 8000

# Define the command to run the application when the container starts
CMD ["npm", "start"]