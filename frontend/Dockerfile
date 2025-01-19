# Stage 1: Build React Application
FROM node:22.11.0-alpine AS build

WORKDIR /usr/src/app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы
COPY . .

# Выполняем сборку
RUN npm run build && ls -la /usr/src/app/build

# Stage 2: Serve React Application with Nginx
FROM nginx:stable-alpine

# Копируем собранные файлы в Nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
