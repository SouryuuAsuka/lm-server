FROM node:18

# создание директории приложения
WORKDIR /usr/src/docker/lampymarket-server

COPY package*.json ./

RUN npm install

# копируем исходный код
COPY . .

CMD [ "npm", "run", "start:debug" ]