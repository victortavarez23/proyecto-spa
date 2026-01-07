# --- Etapa 1: Builder (Construcción) ---
# Usamos Node para compilar el código de React [cite: 187]
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Ejecutamos el build. En tu caso genera la carpeta 'build' [cite: 192]
RUN npm run build

# --- Etapa 2: Servidor Nginx (Producción) ---
# Usamos Nginx para servir los archivos estáticos (HTML, CSS, JS) [cite: 193]
FROM nginx:alpine

# ¡OJO AQUÍ! Copiamos la carpeta 'build' (no 'dist') al servidor Nginx
# Esta es la adaptación clave para Create React App
COPY --from=builder /app/build /usr/share/nginx/html

# Exponemos el puerto 80 (estándar web) [cite: 195]
EXPOSE 80

# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]