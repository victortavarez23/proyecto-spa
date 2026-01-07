# --- Etapa 1: Builder (Construcción) ---
# Usamos una imagen ligera de Node.js [cite: 158]
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo [cite: 159]
WORKDIR /app

# Copiamos primero los archivos de dependencias para aprovechar la caché de Docker [cite: 160-161]
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo devDependencies) [cite: 162-163]
RUN npm ci

# Copiamos todo el código fuente [cite: 164]
COPY . .

# --- Etapa 2: Production (Ejecución) ---
# Creamos una imagen limpia y optimizada para producción [cite: 166-167]
FROM node:20-alpine AS production

WORKDIR /app

# Instalamos PM2 para gestionar el proceso en producción [cite: 172]
RUN npm install -g pm2@latest

# Copiamos los package.json de la etapa anterior [cite: 173]
COPY --from=builder /app/package*.json ./

# Instalamos SOLO dependencias de producción y limpiamos caché [cite: 174]
RUN npm ci --only=production && npm cache clean --force

# Copiamos el código de la aplicación desde la etapa builder [cite: 175]
COPY --from=builder /app .

# Exponemos el puerto que usa tu backend (5000) [cite: 177]
EXPOSE 5000

# Definimos la variable de entorno para producción [cite: 178]
ENV NODE_ENV=production

# Comando de inicio usando PM2 (Adaptado a server.js) [cite: 180]
CMD ["pm2-runtime", "server.js"]