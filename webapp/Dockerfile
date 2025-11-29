# ========================================
# Stage 1: 依存関係のインストール
# ========================================
FROM node:20-alpine AS deps
WORKDIR /app

# package.jsonとpackage-lock.jsonのみをコピー
# （ソースコードが変更されても、依存関係が変わらなければこのレイヤーはキャッシュされる）
COPY package*.json ./

# npm ciで依存関係を正確にインストール（lockファイルに基づく、本番環境向け）
RUN npm ci

# ========================================
# Stage 2: アプリケーションのビルド
# ========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Stage 1でインストールしたnode_modulesをコピー
COPY --from=deps /app/node_modules ./node_modules

# ソースコード全体をコピー（.dockerignoreで除外されたファイル以外）
COPY . .

# Next.jsアプリケーションをビルド
# standalone出力モードで、必要最小限のファイルのみ生成される
RUN npm run build

# ========================================
# Stage 3: 本番環境用の軽量イメージ
# ========================================
FROM node:20-alpine AS runner
WORKDIR /app

# 本番環境モードに設定
ENV NODE_ENV=production

# セキュリティのため、rootユーザーではなく専用ユーザーを作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 静的ファイル（画像など）をコピー
COPY --from=builder /app/public ./public

# standaloneビルド結果をコピー（必要な依存関係のみが含まれる）
# nextjsユーザーに所有権を付与
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# ビルド済みの静的アセット（CSS、JSなど）をコピー
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# nextjsユーザーでアプリケーションを実行（セキュリティ向上）
USER nextjs

# コンテナがリッスンするポートを宣言（ドキュメント目的）
EXPOSE 3000

# Next.jsサーバーの設定
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# アプリケーション起動コマンド
# standaloneモードではserver.jsが生成される
CMD ["node", "server.js"]