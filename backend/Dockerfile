#Используем образ линукс Alpine с версией node 
FROM node:22.11.0-alpine

# Указываем нашу рабочую дерикторию 
WORKDIR /app 

# Скопировать package.json и packahe-Loke.json внутрь контейнера
COPY package*.json ./

#Устанавливаем зависимости 
RUN npm install 

#Копируем оставшиеся приложения в контейнер
COPY . .

#Установить PRISMA

RUN npm install -g prisma

#Генеирируем Prisma client
RUN prisma generate

# Копируем Prisma schema 
COPY prisma/schema.prisma ./prisma/

#Открыть порт в нашем контейнере 
EXPOSE 3000

#Запускаем наш сервер
CMD ["npm","start"]

