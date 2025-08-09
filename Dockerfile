# 1. Builder Stage: 빌드 환경
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# package.json과 lock 파일을 먼저 복사하여 의존성 캐싱 활용
COPY package*.json ./

# 모든 의존성 설치 (빌드에 devDependencies 필요)
RUN npm install

# 소스코드 및 기타 파일 복사
COPY . .

# Prisma Client 생성
RUN npx prisma generate

# 애플리케이션 빌드
RUN npm run build

# --- 

# 2. Production Stage: 최종 실행 환경
FROM node:20-alpine

WORKDIR /usr/src/app

# 프로덕션 환경 설정
ENV NODE_ENV=production

# package.json과 lock 파일을 먼저 복사
COPY package*.json ./

# 프로덕션용 의존성만 설치하여 이미지 크기 최적화
RUN npm install --omit=dev

# 빌드 스테이지에서 결과물만 복사
COPY --from=builder /usr/src/app/dist ./dist

# Prisma 스키마와 생성된 클라이언트 복사
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/generated ./generated

# 애플리케이션이 사용할 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "dist/main.js"]
