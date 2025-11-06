# VC Task Manager Frontend

このディレクトリには VC 向けタスク管理サービスのフロントエンドの静的サイトが含まれています。Tailwind CSS と素の JavaScript を使ったシングルページアプリとして構成されています。

## 概要

`index.html` は CDN から Tailwind CSS を読み込み、`main.js` に記述されたロジックで DOM を操作します。バックエンド API との通信には `fetch` を利用しています。

## 起動方法

ローカル環境で簡単に試す場合、Pythonの簡易HTTPサーバーなどで静的ファイルを提供します。

```bash
cd vc_task_manager_frontend
python -m http.server 3000
```

ブラウザで `http://localhost:3000` にアクセスするとアプリケーションが表示されます。環境に合わせてバックエンドAPIのURLを `main.js` 内の `API_BASE_URL` に設定してください。

`main.js` では、バックエンド API のベース URL を `API_BASE` 定数で定義しています。ローカル実行時は `http://localhost:8000/api` を指すようにしてあります。Vercel 等にデプロイする場合は、環境変数や `window.API_BASE_URL` を設定し、`API_BASE` が適切なエンドポイントを指すように調整してください。

## デプロイ

Vercelでは静的サイトとしてデプロイできます。プロジェクトルートをこのディレクトリに設定し、build ステップは不要です。デプロイ後、バックエンドAPIのURLを環境変数または `main.js` 内の定数で調整してください.
