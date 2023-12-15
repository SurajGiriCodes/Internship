
# Use an official Node.js image as the base image
FROM node:16-alpine

#Set the workign directory
WORKDIR /app

#Copy package.json and package-lock.json to the working directory
COPY package*.json ./
-

RUN npm install


COPY . .

EXPOSE 3000

CMD ["npm","start"]
