#!/bin/sh
set -e
cd /var/www/html

# La clave se genera una vez y se guarda en el volumen de storage.
if [ -z "$APP_KEY" ]; then
    if [ ! -f storage/app/.app_key ]; then
        php artisan key:generate --show > storage/app/.app_key
    fi
    export APP_KEY="$(cat storage/app/.app_key)"
fi

echo "Esperando la base de datos..."
until php -r "new PDO('mysql:host='.getenv('DB_HOST').';port='.(getenv('DB_PORT') ?: 3306), getenv('DB_USERNAME'), getenv('DB_PASSWORD'));" 2>/dev/null; do
    sleep 2
done

php artisan migrate --force
if [ "$APP_DEMO" = "true" ] && [ "$(php artisan tinker --execute='echo \App\Models\User::count();')" = "0" ]; then
    php artisan db:seed --force
fi
php artisan config:cache
php artisan route:cache
php artisan view:cache
chown -R www-data:www-data storage bootstrap/cache

exec "$@"
