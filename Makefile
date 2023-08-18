###予めnodeとyarnのインストールが必要
include .env

default:
	@make migrate
up:
	docker-compose up -d
build:
	docker-compose build --no-cache --force-rm
laravel-install:
	docker-compose exec app composer create-project --prefer-dist laravel/laravel .
create-project:
	@make build
	@make up
	@make laravel-install
	docker-compose exec app php artisan key:generate
	docker-compose exec app php artisan storage:link
	docker-compose exec app chmod -R 777 storage bootstrap/cache
	@make yarn-install
	@make fresh
install-recommend-packages:
	docker-compose exec app composer require doctrine/dbal "^2"
	docker-compose exec app composer require --dev ucan-lab/laravel-dacapo
	docker-compose exec app composer require --dev barryvdh/laravel-ide-helper
	docker-compose exec app composer require --dev beyondcode/laravel-dump-server
	docker-compose exec app composer require --dev barryvdh/laravel-debugbar
	docker-compose exec app composer require --dev roave/security-advisories:dev-master
	docker-compose exec app php artisan vendor:publish --provider="BeyondCode\DumpServer\DumpServerServiceProvider"
	docker-compose exec app php artisan vendor:publish --provider="Barryvdh\Debugbar\ServiceProvider"
init:
	docker-compose up -d --build
	docker-compose exec app mkdir -p storage/framework/cache/data/
	docker-compose exec app mkdir -p storage/framework/app/cache
	docker-compose exec app mkdir -p storage/framework/sessions
	docker-compose exec app mkdir -p storage/framework/views
	docker-compose exec app composer install
	docker-compose exec app chmod 777 -R /work
	docker-compose exec app cp .env.example .env
	docker-compose exec app php artisan key:generate
	docker-compose exec app php artisan storage:link
	docker-compose exec app chmod -R 777 storage bootstrap/cache
	@make yarn-install
	@make yarn-dev
	@make fresh
	docker-compose exec db bash -c "echo \"create user 'root'@'127.*' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to 'root'@'127.*' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"create user 'root'@'172.*' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to 'root'@'172.*' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"create user 'root'@'192.*' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to 'root'@'192.*' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"create user 'root'@'_gateway' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to 'root'@'_gateway' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"create user '$(DB_USERNAME)'@'127.*' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to '$(DB_USERNAME)'@'127.*' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"create user '$(DB_USERNAME)'@'172.*' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to '$(DB_USERNAME)'@'172.*' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"create user '$(DB_USERNAME)'@'192.*' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to '$(DB_USERNAME)'@'192.*' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"create user '$(DB_USERNAME)'@'_gateway' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to '$(DB_USERNAME)'@'_gateway' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
init-staging:
	export NODE_OPTIONS="--max-old-space-size=1024"
	php ./composer.phar install
	-@chmod 777 -R ./
	php artisan key:generate
	php artisan storage:link
	-@chmod -R 777 storage bootstrap/cache
	@make yarn-install
	@make yarn-dev
	php ./artisan migrate
	php artisan scribe:generate
remake:
	@make destroy
	@make init
remake-staging:
	@make destroy-staging
	@make init-staging
stop:
	docker-compose stop
down:
	docker-compose down --remove-orphans
restart:
	@make down
	@make up
destroy:
	docker-compose exec app unlink /work/public/storage
	docker-compose exec app unlink /work/public/doc
	docker-compose exec app rm -rf /work/storage/answer-pdf-test/* /work/storage/docstorage-local/* /work/storage/filestorage-local/*  /work/storage/request-csv-test/*
	docker-compose down --rmi all --volumes --remove-orphans
destroy-staging:
	unlink ./public/storage
	unlink ./public/doc
	rm -rf ./storage/answer-pdf-test/* /work/storage/docstorage-local/* /work/storage/filestorage-local/*  /work/storage/request-csv-test/*
destroy-volumes:
	docker-compose down --volumes --remove-orphans
ps:
	docker-compose ps
logs:
	docker-compose logs
logs-watch:
	docker-compose logs --follow
log-web:
	docker-compose logs web
log-web-watch:
	docker-compose logs --follow web
log-app:
	docker-compose logs app
log-app-watch:
	docker-compose logs --follow app
log-db:
	docker-compose logs db
log-db-watch:
	docker-compose logs --follow db
web:
	docker-compose exec web ash
app:
	docker-compose exec app bash
migrate:
	docker-compose stop
	docker-compose up -d app db
	docker-compose exec app bash -c "sleep 20"
	docker-compose exec db bash -c "mysqldump -u root -p$(DB_PASSWORD) --hex-blob $(DB_DATABASE) > /dbBackup/db_before_migrate.sql"
	docker-compose down --remove-orphans --volumes
	docker-compose up -d --build
	docker-compose exec app bash -c "sleep 60"
	docker-compose exec db bash -c "mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE) < /dbBackup/db_before_migrate.sql"
	docker-compose exec app composer install
	docker-compose exec app php artisan migrate
	docker-compose exec db bash -c "echo \"create user 'root'@'127.*' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to 'root'@'127.*' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"create user 'root'@'172.*' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to 'root'@'172.*' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"create user 'root'@'192.*' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to 'root'@'192.*' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"create user 'root'@'_gateway' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to 'root'@'_gateway' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"create user '$(DB_USERNAME)'@'127.*' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to '$(DB_USERNAME)'@'127.*' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"create user '$(DB_USERNAME)'@'172.*' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to '$(DB_USERNAME)'@'172.*' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"create user '$(DB_USERNAME)'@'192.*' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to '$(DB_USERNAME)'@'192.*' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"create user '$(DB_USERNAME)'@'_gateway' identified by '$(DB_PASSWORD)';\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	docker-compose exec db bash -c "echo \"grant all on $(DB_DATABASE).* to '$(DB_USERNAME)'@'_gateway' with grant option;\" | mysql -u root -p$(DB_PASSWORD) $(DB_DATABASE)"
	yarn install
	yarn run dev
	docker-compose exec app bash -c "rm -f /work/.scribe/endpoints.cache/*"
#	docker-compose exec app php artisan scribe:generate
migrate-staging:
	export NODE_OPTIONS="--max-old-space-size=1024"
	php ./composer.phar install
	php artisan migrate
	yarn install
	yarn run dev
	php artisan scribe:generate
fresh:
	docker-compose exec app php artisan migrate:fresh --seed
seed:
	docker-compose exec app php artisan db:seed
dacapo:
	docker-compose exec app php artisan dacapo
rollback-test:
	docker-compose exec app php artisan migrate:fresh
	docker-compose exec app php artisan migrate:refresh
tinker:
	docker-compose exec app php artisan tinker
test:
	docker-compose exec app php artisan test
optimize:
	docker-compose exec app php artisan optimize
optimize-clear:
	docker-compose exec app php artisan optimize:clear
cache:
	docker-compose exec app composer dump-autoload -o
	@make optimize
	docker-compose exec app php artisan event:cache
	docker-compose exec app php artisan view:cache
cache-clear:
	docker-compose exec app composer clear-cache
	@make optimize-clear
	docker-compose exec app php artisan event:clear
npm:
	@make npm-install
npm-install:
	docker-compose exec web npm install
npm-dev:
	docker-compose exec web npm run dev
npm-watch:
	docker-compose exec web npm run watch
npm-watch-poll:
	docker-compose exec web npm run watch-poll
npm-hot:
	docker-compose exec web npm run hot
yarn:
	yarn
yarn-install:
	@make yarn
yarn-dev:
	yarn dev
yarn-watch:
	yarn watch
yarn-watch-poll:
	yarn watch-poll
yarn-hot:
	yarn hot
db:
	docker-compose exec db bash
sql:
	docker-compose exec app bash -c 'mysql -u $(DB_USERNAME) -h db -p$(DB_PASSWORD) $(DB_DATABASE)'
redis:
	docker-compose exec redis redis-cli
ide-helper:
	docker-compose exec app php artisan clear-compiled
	docker-compose exec app php artisan ide-helper:generate
	docker-compose exec app php artisan ide-helper:meta
	docker-compose exec app php artisan ide-helper:models --nowrite
db-backup:
	docker-compose stop
	docker-compose up -d app db
	docker-compose exec app bash -c "sleep 20"
	docker-compose exec db bash -c "mysqldump -u root -p$(DB_PASSWORD) --hex-blob $(DB_DATABASE) > /dbBackup/db_backup_`date '+%Y%m%d%H%M%S'`.sql"
	docker-compose up -d
doc-update:
	docker-compose up -d app db
	docker-compose exec app bash -c "rm -f /work/.scribe/endpoints.cache/*"
	docker-compose exec app bash -c "php artisan scribe:generate"
