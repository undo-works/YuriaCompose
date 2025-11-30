# README

## 開発中に使うコマンドなど

### Docker

```bash
# Docker composeでまとめてビルド
docker compose build

# Docker composeでまとめて実行
docker compose up
```

### ECR

```bash
# 1. ECRにログイン
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 792581287403.dkr.ecr.ap-northeast-1.amazonaws.com

# 2. イメージにECRタグを付ける
docker tag yuriacompose-botapp:latest 792581287403.dkr.ecr.ap-northeast-1.amazonaws.com/yuria/botapp:latest
docker tag yuriacompose-webapp:latest 792581287403.dkr.ecr.ap-northeast-1.amazonaws.com/yuria/webapp:latest
# Composeか直接かのビルドの違いでREPOSITORYの名前も変わるので注意

# 3. ECRにプッシュ
docker push 792581287403.dkr.ecr.ap-northeast-1.amazonaws.com/yuria/botapp:latest
docker push 792581287403.dkr.ecr.ap-northeast-1.amazonaws.com/yuria/webapp:latest
```

### ECS

#### 更新方法（イメージを更新した場合）

```bash
# サービスを強制更新（最新イメージを取得）
aws ecs update-service \
  --cluster yuria-cluster \
  --service webapp-service \
  --force-new-deployment \
  --region ap-northeast-1

aws ecs update-service \
  --cluster yuria-cluster \
  --service botapp-service \
  --force-new-deployment \
  --region ap-northeast-1
```

#### 停止方法（課金を止める）

```bash
# タスク数を0に
aws cloudformation update-stack \
  --stack-name yuria-ecs-stack \
  --use-previous-template \
  --parameters \
    ParameterKey=WebAppImageUri,UsePreviousValue=true \
    ParameterKey=BotAppImageUri,UsePreviousValue=true \
  --capabilities CAPABILITY_NAMED_IAM \
  --region ap-northeast-1

# または直接サービスを更新
aws ecs update-service \
  --cluster yuria-cluster \
  --service webapp-service \
  --desired-count 0 \
  --region ap-northeast-1

aws ecs update-service \
  --cluster yuria-cluster \
  --service botapp-service \
  --desired-count 0 \
  --region ap-northeast-1
```

## 初回設定

### Git

```bash
# リモートリポジトリの登録
git remote add origin https://github.com/undo-works/YuriaCompose.git
```

### ECR

```bash
# botappプライベートリポジトリの作成
aws ecr create-repository --repository-name yuria/botapp --region ap-northeast-1

# webappプライベートリポジトリの作成
aws ecr create-repository --repository-name yuria/webapp --region ap-northeast-1
```

## その他便利なコマンド

### ECS

```bash
aws ecs update-service \
  --cluster yuria-cluster \
  --service yuria-botapp-service-kw1fk9f6 \
  --force-new-deployment \
  --region ap-northeast-1
```

### Docker

```bash
# 実行中のプロセス確認
docker ps

# ビルド済みのイメージ一覧
docker images

# 指定したイメージの削除
docker rmi <IMAGE_ID>
```

### Git

```bash
# プッシュ
git push origin main

# リモートリポジトリの確認
git remote -v
```