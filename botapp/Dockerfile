# ========================================
# ビルドステージ（TypeScriptをコンパイル）
# ========================================
FROM node:20-alpine AS builder

WORKDIR /app

# package.jsonをコピーして依存関係をインストール（devDependencies含む）
COPY package*.json ./
RUN npm ci

# ソースコードをコピー
COPY . .

# TypeScriptをビルド
RUN npm run build

# ビルド結果を確認（デバッグ用）
RUN ls -la dist/

# ========================================
# 実行ステージ（本番環境）
# ========================================
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# package.jsonをコピーして本番依存関係のみインストール
COPY package*.json ./
RUN npm ci --only=production

# ビルド済みファイルをコピー
COPY --from=builder /app/dist ./dist

# ポートを公開
EXPOSE 5000

# アプリケーション起動
CMD ["npm", "start"]