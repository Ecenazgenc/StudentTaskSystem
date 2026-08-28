# ===== Stage 1: Node Build =====
FROM node:22-alpine AS build

WORKDIR /app

# Bağımlılıkları önce kopyala (Docker cache optimizasyonu)
COPY package.json package-lock.json ./
RUN npm ci

# Kaynak kodu kopyala ve derle
COPY . .
RUN npm run build

# ===== Stage 2: Nginx ile Statik Dosya Sunumu =====
FROM nginx:alpine

# Varsayılan nginx config yerine özel config koy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build çıktısını nginx'e kopyala
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
