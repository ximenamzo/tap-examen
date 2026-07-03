FROM php:8.2-fpm

# Dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    pkg-config \
    libssl-dev \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl gd

# Extensi[on de MongoDB para PHP
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

EXPOSE 9000
CMD ["php-fpm"]

