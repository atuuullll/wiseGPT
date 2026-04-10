# Production Deployment Guide

## Gunicorn Configuration

### Quick Start

**1. Install dependencies:**
```bash
pip install -r requirements.txt
```

**2. Run with Gunicorn:**
```bash
gunicorn --workers=4 --threads=2 --worker-class=gthread --bind=0.0.0.0:5000 server:app
```

### Configuration Options

| Option | Value | Description |
|--------|-------|-------------|
| `--workers` | 4-8 | Number of worker processes |
| `--threads` | 2-4 | Threads per worker |
| `--worker-class` | gthread | Async worker with threading |
| `--bind` | 0.0.0.0:5000 | Host and port |
| `--timeout` | 120 | Worker timeout (seconds) |
| `--access-logfile` | - | Log file (- for stdout) |
| `--error-logfile` | - | Error log (- for stderr) |
| `--log-level` | info | Logging level |
| `--keep-alive` | 5 | Keep-alive timeout |

---

## Nginx Reverse Proxy Setup

### Install Nginx
```bash
# Ubuntu/Debian
sudo apt-get install nginx

# macOS
brew install nginx
```

### Configure Nginx

Create `/etc/nginx/sites-available/llm-api`:

```nginx
upstream llm_app {
    # Gunicorn socket binding
    server 127.0.0.1:5000;
}

# Rate limiting zone (optional)
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/m;

server {
    listen 80;
    server_name api.example.com;
    client_max_body_size 10M;

    # Logging
    access_log /var/log/nginx/llm-api-access.log;
    error_log /var/log/nginx/llm-api-error.log;

    # Health check endpoint (no rate limiting)
    location /health {
        proxy_pass http://llm_app;
    }

    # API endpoints with rate limiting
    location /generate {
        limit_req zone=api_limit burst=10 nodelay;
        proxy_pass http://llm_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
        proxy_connect_timeout 60s;
    }

    location /generate-blog {
        limit_req zone=api_limit burst=10 nodelay;
        proxy_pass http://llm_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    location /generate-summary {
        limit_req zone=api_limit burst=10 nodelay;
        proxy_pass http://llm_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    # Static files (API docs, etc.)
    location / {
        proxy_pass http://llm_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Enable Nginx Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/llm-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Systemd Service

Create `/etc/systemd/system/llm-api.service`:

```ini
[Unit]
Description=LLM Content Generator API
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/opt/llm-api
EnvironmentFile=/opt/llm-api/.env
ExecStart=/opt/llm-api/venv/bin/gunicorn \
    --workers=4 \
    --threads=2 \
    --worker-class=gthread \
    --bind=127.0.0.1:5000 \
    --timeout=120 \
    --access-logfile=/var/log/llm-api/access.log \
    --error-logfile=/var/log/llm-api/error.log \
    server:app

Restart=on-failure
RestartSec=10

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/var/log/llm-api

[Install]
WantedBy=multi-user.target
```

### Manage Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Start service
sudo systemctl start llm-api

# Enable on boot
sudo systemctl enable llm-api

# View status
sudo systemctl status llm-api

# View logs
sudo journalctl -u llm-api -f
```

---

## Supervisor Setup

### Install Supervisor

```bash
# Ubuntu/Debian
sudo apt-get install supervisor

# macOS
brew install supervisor
```

### Create Configuration

Use the provided `supervisord.conf` and place in `/etc/supervisor/conf.d/llm-api.conf`

### Manage Supervisor

```bash
# Reload configuration
sudo supervisorctl reread
sudo supervisorctl update

# Check status
sudo supervisorctl status

# Start/stop/restart
sudo supervisorctl start llm-api
sudo supervisorctl stop llm-api
sudo supervisorctl restart llm-api

# View logs
sudo tail -f /var/log/supervisor/llm-api.log
```

---

## SSL/TLS with Let's Encrypt

### Install Certbot

```bash
sudo apt-get install certbot python3-certbot-nginx
```

### Generate Certificate

```bash
sudo certbot certonly --nginx -d api.example.com
```

### Update Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.example.com;
    return 301 https://$server_name$request_uri;
}
```

### Auto-renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Auto-renewal is typically enabled by default
sudo systemctl status certbot.timer
```

---

## Performance Tuning

### Worker Count

```bash
# Recommended formula: (2 x CPU cores) + 1
# For 8 cores: (2 x 8) + 1 = 17 workers
gunicorn --workers=17 server:app
```

### Thread Configuration

```bash
# Use gthread worker class with multiple threads
gunicorn --worker-class=gthread --workers=4 --threads=2 server:app
```

### Backlog Size

```bash
gunicorn --backlog=2048 server:app
```

### Max Requests

Restart workers periodically to prevent memory leaks:

```bash
gunicorn --max-requests=1000 --max-requests-jitter=100 server:app
```

---

## Monitoring & Logging

### Application Logs

```bash
# Follow Gunicorn logs
tail -f /var/log/llm-api.log

# Check Nginx logs
tail -f /var/log/nginx/llm-api-access.log
tail -f /var/log/nginx/llm-api-error.log
```

### System Monitoring

```bash
# Monitor resource usage
top
htop
iotop

# Check disk space
df -h

# Monitor network
nethogs
iftop
```

### Application Metrics

Add to `server.py` for custom metrics:

```python
from flask import jsonify

@app.route('/metrics')
def metrics():
    return jsonify({
        "requests_total": request_count,
        "errors_total": error_count,
        "uptime_seconds": uptime,
        "workers_active": active_workers
    })
```

---

## Backup & Recovery

```bash
# Backup application
tar -czf llm-api-backup-$(date +%Y%m%d).tar.gz /opt/llm-api

# Backup logs
tar -czf llm-api-logs-$(date +%Y%m%d).tar.gz /var/log/llm-api

# Backup database/configs
cp -r /database/path backup-location
```

---

## Security Checklist

- [ ] Configure firewall
- [ ] Enable SSL/TLS
- [ ] Set strong API keys
- [ ] Configure rate limiting
- [ ] Enable request validation
- [ ] Configure CORS if needed
- [ ] Monitor logs regularly
- [ ] Keep dependencies updated
- [ ] Use secrets manager
- [ ] Regular backups

---

## Troubleshooting

### Application won't start
```bash
# Check logs
journalctl -u llm-api -n 50

# Verify configuration
python -m py_compile server.py

# Test import
python -c "import server"
```

### High memory usage
```bash
# Set max requests
gunicorn --max-requests=1000 server:app

# Monitor memory
watch -n 5 'ps aux | grep gunicorn'
```

### Slow response times
```bash
# Check worker count
ps aux | grep gunicorn | wc -l

# Increase workers if needed
# Monitor CPU and memory before increasing
```

### Connection timeouts
```bash
# Increase timeout
gunicorn --timeout=300 server:app

# Check nginx timeout settings
proxy_read_timeout 300s;
```

---

## Additional Resources

- [Gunicorn Documentation](https://gunicorn.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Supervisor Documentation](http://supervisord.org/)
