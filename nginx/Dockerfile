# Image officielle Nginx basée sur Alpine Linux
FROM nginx:1.28-alpine

# Copier les fichiers frontend dans le répertoire web de Nginx
COPY frontend/ /usr/share/nginx/html/

# Copier notre configuration Nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Documenter le port HTTP utilisé
EXPOSE 80
