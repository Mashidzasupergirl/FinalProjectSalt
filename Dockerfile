FROM node:12

WORKDIR /app

COPY package*.json /app/server

RUN npm install

COPY . .

ENV PORT=8080


EXPOSE 8080

CMD ["npm", "start"]
