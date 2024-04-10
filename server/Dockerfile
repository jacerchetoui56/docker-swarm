FROM node:17-alpine

RUN npm install -g nodemon 

WORKDIR /app

COPY package*.json .

RUN npm install 

COPY . .

CMD ["npm","run", "dev"]

EXPOSE 3000