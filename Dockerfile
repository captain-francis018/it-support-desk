# 1. image de base avec node.js 22
FROM node:22-bookworm-slim

# 2. Définir l'environnement de production
ENV NODE_ENV=production

# 3. Définir le répertoire de travail
WORKDIR /app

# 4. Copier les fichiers de dependances
COPY backend/package*.json ./

# 5. Installer uniquement les dépendances
RUN npm ci --omit=dev

# 6. Copier le code de l'application
COPY --chown=node:node backend/ ./

# 7. Utiliser un user non root pour exécuter l'application
USER node

# 8. Exposer le port sur lequel l'application va écouter
EXPOSE 3000

# 9. Vérifier automatiquement l'état de santé de l'API
HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r => process.exit(r.status === 200 ? 0 : 1)).catch(() => process.exit(1))"

# 10. Commande pour démarrer l'application
CMD ["npm", "start"]