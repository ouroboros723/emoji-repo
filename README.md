ドキュメント準備中...

# 動作に必要なもの
- GNU Make
- Docker
- docker-compose
- laravel-echo-server

PHP 8.5・Composer・Node.js 24・pnpm は app コンテナに入っているため、ホストへのインストールは不要です。
（`make init-staging` / `make migrate-staging` では、`php artisan` だけはサーバー上の PHP 8.5 で実行します。）

# セットアップ方法
- `.env.example` を `.env` という名前でコピーします。
    - Twitterログインを使用するには、APIキーを取得して.envにセットする必要があります。
- `laravel-echo-server.json.sample` を `laravel-echo-server.json` という名前でコピーします。
- `make init` コマンドを実行します。
- http://localhost へアクセスします。
# 本番環境のバージョン表示
Docker Compose を使用する場合、nginx と PHP の追加設定ディレクトリはコンテナにマウントされます。
本番環境だけで次のファイルを作成すると、nginx のバージョンと PHP の `X-Powered-By` が非表示になります（`Server: nginx` は残ります）。

```sh
cp infra/docker/nginx/conf.d/production.conf.example infra/docker/nginx/conf.d/production.conf
cp infra/docker/php/conf.d/production.ini.example infra/docker/php/conf.d/production.ini
```

設定ファイルの変更後は、`docker compose restart app web` で反映できます。初めてこのマウント設定を導入する際は、先に `docker compose up -d --build app web` でコンテナを再作成してください。
ホスト上で PHP を実行する staging 環境はコンテナの設定対象外です。

# makeコマンド
- `make init` docker-compose経由でセットアップを開始します。
- `make reinit` .envの生成を除くセットアップ手順をdocker-compose経由で再実行します。
- `make init-staging` サーバー上に直接展開します。
- `make migrate` docker-compose経由でシステムのアップデート処理を行います。
- `make migrate-staging` システムのアップデート処理をサーバー上で直接行います。
- `make start-service` docker-compose経由で、常駐サービスを開始します。(写真一覧のリアルタイム更新に必要です。)
- `make pnpm-install` app コンテナでフロントエンドの依存パッケージをインストールします。
- `make pnpm-dev` / `make pnpm-prod` app コンテナでフロントエンドをビルドします（開発用 / 本番用）。
- `make pnpm-watch` / `make pnpm-watch-poll` app コンテナでファイルの変更を監視してビルドします。

# artisan コマンド
- `docker-compose exec app php artisan admin:add-user` 管理者ユーザーを追加します。
- `docker-compose exec app php artisan admin:delete-user --id=管理者ID` 管理者ユーザーを追加します。

# ライセンス
- 当ソフトウェアはApache License v2.0に準拠します。
