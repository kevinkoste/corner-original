FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json .
RUN npm install

# Copy all other source code to work directory
ADD . /usr/src/app
RUN npm run build

CMD [ "npm", "start" ]
EXPOSE 8000
