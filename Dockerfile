# 1. Base Stage: pnpm 설치
FROM node:20-alpine AS base
RUN npm i -g pnpm

# 2. Builder Stage: 의존성 설치 및 애플리케이션 빌드
FROM base AS builder
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

# --offline 플래그는 네트워크를 사용하지 않고 스토어에서만 설치하도록 강제합니다.
# 의존성을 먼저 fetch 하여 Docker 캐시 효율을 극대화합니다.
RUN pnpm fetch
RUN pnpm install -r --offline

COPY . .

# Prisma Client 생성 및 애플리케이션 빌드
RUN pnpm exec prisma generate
RUN pnpm build

# 3. Production Stage: 실행에 필요한 파일만 포함
FROM base AS production
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

# 프로덕션용 의존성만 설치
RUN pnpm fetch --prod
RUN pnpm install -r --prod --offline

# 빌드 스테이지에서 결과물만 복사
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/generated ./generated

EXPOSE 3000
CMD ["node", "dist/main.js"]
