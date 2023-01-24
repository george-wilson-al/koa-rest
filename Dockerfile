FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 1337
CMD [ "npm", "run", "start" ]
