ドキュメント準備中...

# 動作に必要なもの
- node.js（Ver.18 LTS）
- yarn（npmは取り敢えず非推奨とします）
- GNU Make
- Docker
- docker-compose
- laravel-echo-server

# セットアップ方法
- `.env.example` を `.env` という名前でコピーします。
    - Twitterログインを使用するには、APIキーを取得して.envにセットする必要があります。
- `laravel-echo-server.json.sample` を `laravel-echo-server.json` という名前でコピーします。
- `make init` コマンドを実行します。
- http://localhost へアクセスします。
# makeコマンド
- `make init` docker-compose経由でセットアップを開始します。
- `make reinit` .envの生成を除くセットアップ手順をdocker-compose経由で再実行します。
- `make init-staging` サーバー上に直接展開します。
- `make migrate` docker-compose経由でシステムのアップデート処理を行います。
- `make migrate-staging` システムのアップデート処理をサーバー上で直接行います。
- `make start-service` docker-compose経由で、常駐サービスを開始します。(写真一覧のリアルタイム更新に必要です。)

# artisan コマンド
- `docker-compose exec app php artisan admin:add-user` 管理者ユーザーを追加します。
- `docker-compose exec app php artisan admin:delete-user --id=管理者ID` 管理者ユーザーを追加します。

# ライセンス
- 当ソフトウェアはGPL v3.0に準拠します。
- 一部のシステムアイコンに[icon8](https://icons8.jp/)の画像を使用しています。
