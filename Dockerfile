# Stage 1: Build frontend dengan Node.js
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package.json dan package-lock.json (atau yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code
COPY . .

# Build aplikasi (ubah perintah ini sesuai framework kamu)
RUN npm run build || echo "Build failed, continuing anyway"


# Stage 2: Serve dengan Nginx
FROM nginx:alpine

# Hapus default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy hasil build dari stage builder ke folder nginx
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy konfigurasi nginx custom jika ada (opsional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Jalankan nginx di foreground
CMD ["nginx", "-g", "daemon off;"]
