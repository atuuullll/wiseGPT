# Docker Deployment Guide

## Quick Start with Docker

### Prerequisites
- Docker installed (version 20.10+)
- Docker Compose installed (version 1.29+)
- Google Gemini API key

### Option 1: Using Docker Compose (Recommended)

**1. Create a `.env` file:**
```bash
cp .env.example .env
```

**2. Edit `.env` and add your Google Gemini API key:**
```env
GOOGLE_API_KEY=your-actual-api-key-here
REQUIRE_AUTH=false
RATE_LIMIT_ENABLED=true
```

**3. Start the application:**
```bash
docker-compose up -d
```

**4. Verify it's running:**
```bash
curl http://localhost:5000/health
```

**5. Stop the application:**
```bash
docker-compose down
```

---

### Option 2: Using Docker Directly

**1. Build the Docker image:**
```bash
docker build -t llm-content-generator:latest .
```

**2. Run the container:**
```bash
docker run -d \
  --name llm-api \
  -p 5000:5000 \
  -e GOOGLE_API_KEY=your-api-key-here \
  -e REQUIRE_AUTH=false \
  -e RATE_LIMIT_ENABLED=true \
  llm-content-generator:latest
```

**3. View logs:**
```bash
docker logs llm-api
```

**4. Stop the container:**
```bash
docker stop llm-api
docker rm llm-api
```

---

## Configuration

### Environment Variables in Docker

All environment variables from `.env` are passed to the container:

```yaml
environment:
  GOOGLE_API_KEY: ${GOOGLE_API_KEY}
  MODEL_NAME: ${MODEL_NAME:-gemini-flash-latest}
  TEMPERATURE: ${TEMPERATURE:-0.7}
  MAX_TOKENS: ${MAX_TOKENS:-1000}
  FLASK_ENV: ${FLASK_ENV:-production}
  REQUIRE_AUTH: ${REQUIRE_AUTH:-false}
  API_KEYS: ${API_KEYS}
  RATE_LIMIT_ENABLED: ${RATE_LIMIT_ENABLED:-true}
  REQUESTS_PER_MINUTE: ${REQUESTS_PER_MINUTE:-30}
```

---

## Common Docker Commands

### View running containers
```bash
docker ps
```

### View all containers
```bash
docker ps -a
```

### View container logs
```bash
docker logs container-name
docker logs -f container-name  # Follow logs
```

### Execute command in container
```bash
docker exec -it container-name bash
```

### Access Python shell in container
```bash
docker exec -it container-name python
```

### Remove container and image
```bash
docker stop container-name
docker rm container-name
docker rmi image-name
```

---

## Docker Compose Commands

### Start services
```bash
docker-compose up        # Foreground
docker-compose up -d     # Background
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs
docker-compose logs -f   # Follow
docker-compose logs api  # Specific service
```

### Rebuild image
```bash
docker-compose build
docker-compose up -d
```

### Remove volumes
```bash
docker-compose down -v
```

---

## Production Deployment

### Using Gunicorn

For production, use Gunicorn instead of Flask's development server:

**1. Update Dockerfile (or create Dockerfile.prod):**
```dockerfile
CMD ["gunicorn", "--workers=4", "--threads=2", "--worker-class=gthread", "--bind=0.0.0.0:5000", "server:app"]
```

**2. Add Gunicorn to requirements.txt:**
```
gunicorn==21.2.0
```

**3. Rebuild and run:**
```bash
docker build -t llm-content-generator:prod .
docker run -p 5000:5000 llm-content-generator:prod
```

### Using Nginx Reverse Proxy

Create `nginx.conf`:
```nginx
upstream app {
    server api:5000;
}

server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Update `docker-compose.yml`:
```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - api
```

---

## Health Checks

Docker Compose includes a health check:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 5s
```

Check container health:
```bash
docker inspect --format='{{.State.Health.Status}}' container-name
```

---

## Performance Optimization

### Resource Limits (docker-compose.yml)
```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 1G
    reservations:
      cpus: '1'
      memory: 512M
```

### Multiple Worker Processes
For Gunicorn, adjust workers based on CPU cores:
```bash
gunicorn --workers=4 server:app
```

---

## Troubleshooting

### Container won't start
```bash
docker logs container-name
```

### Port already in use
```bash
# Find what's using the port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Change the port in docker-compose.yml
ports:
  - "8000:5000"
```

### API key not working in container
- Ensure `.env` file exists and is loaded
- Check if environment variables are being passed correctly
- Verify the `.env` file format (no quotes around values)

### Permission denied errors
Ensure the container has write permissions to volumes:
```bash
docker exec -u root container-name chown -R 1000:1000 /app
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t llm-content-generator:latest .
      
      - name: Run tests
        run: docker run llm-content-generator:latest pytest
```

---

## Security Best Practices

1. **Never commit .env files** - Add to .gitignore
2. **Use secrets management** - Use Docker secrets or environment variables for sensitive data
3. **Run as non-root** - Dockerfile uses appropriate user permissions
4. **Keep base image updated** - Regularly update Python version
5. **Minimal dependencies** - Only install required packages
6. **Health checks** - Monitor container health
7. **Resource limits** - Prevent resource exhaustion

---

## Scaling

### Docker Swarm

```bash
docker swarm init
docker stack deploy -c docker-compose.yml llm-api
```

### Kubernetes

Example `deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: llm-api
  template:
    metadata:
      labels:
        app: llm-api
    spec:
      containers:
      - name: llm-api
        image: llm-content-generator:latest
        ports:
        - containerPort: 5000
        env:
        - name: GOOGLE_API_KEY
          valueFrom:
            secretKeyRef:
              name: llm-api-secrets
              key: google-api-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 10
          periodSeconds: 5
```

---

## Support

For Docker-related issues:
1. Check Docker logs
2. Verify environment variables
3. Ensure API key is valid
4. Check port availability
5. Review Docker Compose configuration
