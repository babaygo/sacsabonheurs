# Étape 1 : builder
FROM node:20 AS builder
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma

# Installe toutes les dépendances (y compris dev, pour tsc et prisma)
RUN npm install

# Génère le client Prisma
RUN npx prisma generate

# Copie le code source et la config TS
COPY tsconfig.json ./
COPY src ./src

# Compile le TypeScript
RUN npm run build

# Étape 2 : runner
FROM node:20 AS runner
WORKDIR /app

# Installe bash
RUN apt-get update && apt-get install -y bash

# Copie node_modules complet (avec @prisma/client et .prisma)
COPY --from=builder /app/node_modules ./node_modules

# Copie le schéma Prisma et le build compilé
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
# Copie le script d'entrypoint
COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["bash", "./entrypoint.sh"]
