# stage 1: build react app
FROM node:22-alpine AS builder
WORKDIR /app
COPY ./react-ui/package.json ./react-ui/package-lock.json ./
RUN npm ci

COPY ./react-ui .
RUN npm run build

# stage 2: serve react app with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]