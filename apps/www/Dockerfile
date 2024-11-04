# apps/www/Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS development
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
CMD ["pnpm", "dev", "--filter", "www"]

FROM base AS builder
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build --filter www

FROM base AS production
COPY --from=builder /app/apps/www/.next ./.next
COPY --from=builder /app/apps/www/public ./public
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["pnpm", "start", "--filter", "www"]