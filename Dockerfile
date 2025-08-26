# Multi-stage build pour optimiser la taille de l'image

# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./
COPY yarn.lock* ./
COPY pnpm-lock.yaml* ./

# Installer les dépendances selon le gestionnaire de paquets détecté
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copier les dépendances installées
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables d'environnement pour le build
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Désactiver la télémétrie Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Build de l'application
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier les fichiers nécessaires
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Changer le propriétaire des fichiers
RUN chown -R nextjs:nodejs /app

# Utiliser l'utilisateur non-root
USER nextjs

# Exposer le port
EXPOSE 3000

# Variables d'environnement
ENV PORT 3000
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Démarrer l'application
CMD ["node", "server.js"]