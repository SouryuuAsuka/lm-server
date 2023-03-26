FROM node:18

# создание директории приложения
WORKDIR /usr/src/docker/projector-panel

COPY package*.json ./

RUN npm install

# копируем исходный код
COPY . .

CMD [ "node", "server.js" ]