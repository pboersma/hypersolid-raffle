# ── build ────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# native-addon toolchain for better-sqlite3
RUN apk add --no-cache python3 make g++ sqlite-dev pkgconfig

RUN corepack enable

# install deps (cached unless lockfile changes)
COPY package.json pnpm-lock.yaml ./
ENV npm_config_build_from_source=true
RUN pnpm install --frozen-lockfile

# build application
COPY . .
RUN pnpm build

# remove dev dependencies — keeps the musl-built better-sqlite3
RUN pnpm prune --prod

# ── runtime ──────────────────────────────────────────────────────
FROM node:22-alpine
WORKDIR /app

# minimal runtime libs for better-sqlite3
RUN apk add --no-cache libstdc++ sqlite-libs

ENV NODE_ENV=production

# copy only what's needed from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist          ./dist
COPY --from=build /app/package.json  ./package.json

# writable directory for the SQLite database file
RUN mkdir -p /app/data && chown node:node /app/data

# drop privileges — node:22-alpine ships a `node` user (uid 1000)
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api || exit 1

CMD ["node", "dist/main.js"]
