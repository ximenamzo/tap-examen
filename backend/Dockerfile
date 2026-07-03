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

# Extension de MongoDB para PHP
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Usuario dentro del contenedor con el mismo UID/GID que el host
# para que los archivos generados dentro del Docker no queden con el usuario root

ARG UID=1000
ARG GID=1001
RUN groupadd -g ${GID} devgroup \
    && useradd -u ${UID} -g devgroup -m -s /bin/bash devuser

# para que php corra como mi user en lugar de www-data
RUN sed -i "s/user = www-data/user = devuser/g; s/group = www-data/group = devgroup/g" \
    /usr/local/etc/php-fpm.d/www.conf

WORKDIR /var/www

USER devuser

EXPOSE 9000
CMD ["php-fpm"]

