FROM php:8.3-fpm

WORKDIR /var/www

# Install system dependencies + PHP extensions
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev zip unzip nodejs npm supervisor \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . .

# Install PHP dependencies
RUN php -d memory_limit=-1 /usr/bin/composer install

# Install Node dependencies
RUN npm install

# Expose Laravel + Vite ports
EXPOSE 8000 5173

# Copy supervisord config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Start supervisord to run Laravel, queue, and Vite
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
