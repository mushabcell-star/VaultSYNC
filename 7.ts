# VaultSync API Gateway Configuration
# Proteksi: TLS 1.3, DDoS Mitigation, & Security Headers

upstream vaultsync_backend {
    server 127.0.0.1:5000;
}

server {
    listen 443 ssl http2;
    server_name api.vaultsync.com;

    # SSL/TLS Configuration
    ssl_certificate /etc/letsencrypt/live/vaultsync/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vaultsync/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers EECDH+AESGCM:EDH+AESGCM;

    # DDoS Protection: Rate Limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    # Security Headers
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'none'; script-src 'self'; object-src 'none';";

    location /api/v1/ {
        proxy_pass http://vaultsync_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}