FROM node:16.17.0


# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Bundle app source
COPY . .

# Install npm packages
RUN npm install

# Build our app for production
RUN npm run build

RUN ls -la

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]