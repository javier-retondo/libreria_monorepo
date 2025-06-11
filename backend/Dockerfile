FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -D ts-node nodemon typescript@5.7.3

CMD ["npm", "run", "dev"]
