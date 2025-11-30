# README

## 前提

* ECRにプライベートリポジトリ作成済み

## デプロイ方法

```bash
# スタック作成
aws cloudformation create-stack \
  --stack-name yuria-ecs-stack \
  --template-body file://cloudformation/yuria-ecs-stack.yaml \
  --parameters \
    ParameterKey=WebAppImageUri,ParameterValue=792581287403.dkr.ecr.ap-northeast-1.amazonaws.com/yuria/webapp:latest \
    ParameterKey=BotAppImageUri,ParameterValue=792581287403.dkr.ecr.ap-northeast-1.amazonaws.com/yuria/botapp:latest \
  --capabilities CAPABILITY_NAMED_IAM \
  --region ap-northeast-1

# スタック作成状況を確認
aws cloudformation describe-stacks \
  --stack-name yuria-ecs-stack \
  --region ap-northeast-1

# イベントを監視
aws cloudformation describe-stack-events \
  --stack-name yuria-ecs-stack \
  --region ap-northeast-1

# ALBのDNS名を取得
aws cloudformation describe-stacks \
  --stack-name yuria-ecs-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`ALBDNSName`].OutputValue' \
  --output text \
  --region ap-northeast-1
```

## 削除方法

```bash
aws cloudformation delete-stack \
  --stack-name yuria-ecs-stack \
  --region ap-northeast-1
```