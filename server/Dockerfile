FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
RUN npm install

# Copy all other source code to work directory
ADD . /usr/src/app
RUN npm run build

CMD [ "npm", "start" ]
EXPOSE 8000
