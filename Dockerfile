FROM php:8.1-apache

# Cài đặt thư viện hỗ trợ cURL cho cổng thanh toán
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Cài đặt các extension PHP cần thiết
RUN docker-php-ext-install mysqli pdo pdo_mysql curl

# Kích hoạt mod_rewrite của Apache
RUN a2enmod rewrite