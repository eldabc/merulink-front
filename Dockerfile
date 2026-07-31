# ============================================================
# DOCKERFILE - Frontend React (Multi-etapa)
# ============================================================
# Este Dockerfile tiene DOS etapas:
#   Etapa 1 (build): Compila el proyecto React con Vite
#   Etapa 2 (nginx):  Sirve los archivos compilados con Nginx
# La magia: solo la etapa 2 va a la imagen final (más ligera)
# ============================================================

# ── ETAPA 1: CONSTRUIR (BUILD) ───────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias primero (para aprovechar caché)
COPY package.json package-lock.json* ./

# Instalar TODAS las dependencias (incluyendo dev, necesarias para build)
RUN npm ci

# Copiar el resto del código
COPY . .

# Construir la aplicación para producción
# Esto genera la carpeta dist/ con archivos HTML, JS y CSS optimizados
RUN npm run build

# ── ETAPA 2: SERVIR CON NGINX ────────────────────────────
FROM nginx:alpine

# Copiar los archivos compilados (de la etapa 1) a Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
