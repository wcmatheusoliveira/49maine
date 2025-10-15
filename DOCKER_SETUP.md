# Docker Setup Guide for 49maine.com

This guide explains how to deploy the 49maine restaurant landing page using Docker and nginx.

## Files Created

- `Dockerfile` - Multi-stage build for optimized Next.js production image
- `docker-compose.yml` - Orchestrates nginx and Next.js services
- `nginx.conf` - Nginx reverse proxy configuration for 49maine.com
- `.dockerignore` - Optimizes Docker build context
- `.env.production` - Production environment variables template

## Quick Start (Development/Testing)

1. **Configure environment variables:**
   ```bash
   cp .env.production .env
   # Edit .env and set AUTH_SECRET (run: openssl rand -base64 32)
   ```

2. **Build and start services:**
   ```bash
   docker-compose up -d --build
   ```

3. **Check logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Access the application:**
   - Local: http://localhost
   - The app will be accessible on port 80

## Production Deployment with SSL

### 1. Initial Setup

Update `.env.production` with production values:
```bash
AUTH_SECRET="your-generated-secret-key"
NEXTAUTH_URL="https://49maine.com"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### 2. Obtain SSL Certificate (Let's Encrypt)

First, start with HTTP only to obtain the certificate:

```bash
# Build and start services
docker-compose up -d --build

# Run certbot to obtain certificate
docker-compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d 49maine.com -d www.49maine.com
```

### 3. Enable HTTPS

After obtaining certificates, edit `nginx.conf`:

1. Uncomment the HTTPS server block (lines starting with `# server {`)
2. Comment out or remove the HTTP proxy location block
3. Uncomment the HTTP to HTTPS redirect

Edit `docker-compose.yml`:
1. Uncomment the `certbot` service for automatic renewal

Restart services:
```bash
docker-compose down
docker-compose up -d
```

## Management Commands

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nextjs
docker-compose logs -f nginx
```

### Restart services
```bash
docker-compose restart
```

### Stop services
```bash
docker-compose down
```

### Rebuild after code changes
```bash
docker-compose up -d --build
```

### Run database migrations
```bash
# Migrations run automatically on container start
# To run manually:
docker-compose exec nextjs npx prisma migrate deploy
```

### Access database
```bash
docker-compose exec nextjs npx prisma studio
```

### View running containers
```bash
docker-compose ps
```

## Database Persistence

The SQLite database is persisted in a Docker volume named `db-data`. This ensures your data survives container restarts and rebuilds.

To backup the database:
```bash
docker-compose exec nextjs cat /app/prisma/prod.db > backup.db
```

To restore:
```bash
docker-compose cp backup.db nextjs:/app/prisma/prod.db
docker-compose restart nextjs
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs nextjs

# Verify environment variables
docker-compose exec nextjs env
```

### Database issues
```bash
# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d --build
```

### SSL certificate issues
```bash
# Check certificate status
docker-compose exec nginx ls -la /etc/letsencrypt/live/49maine.com/

# Test nginx configuration
docker-compose exec nginx nginx -t
```

### Port already in use
```bash
# Find process using port 80
sudo lsof -i :80

# Or change port in docker-compose.yml
ports:
  - "8080:80"  # Change 80 to another port
```

## Production Checklist

- [ ] Generate strong AUTH_SECRET
- [ ] Update NEXTAUTH_URL to https://49maine.com
- [ ] Configure Google Analytics ID
- [ ] Obtain SSL certificates via Let's Encrypt
- [ ] Enable HTTPS in nginx.conf
- [ ] Set up automatic certificate renewal
- [ ] Configure firewall to allow ports 80 and 443
- [ ] Point DNS A record to server IP
- [ ] Test SSL configuration: https://www.ssllabs.com/ssltest/
- [ ] Set up monitoring and log aggregation
- [ ] Configure automated backups for database

## Architecture

```
Internet
    ↓
Nginx (Port 80/443)
    ↓
Next.js App (Port 3000)
    ↓
SQLite Database (Docker Volume)
```

## Security Features

- Multi-stage Docker build (smaller attack surface)
- Non-root user in container
- Rate limiting in nginx
- Security headers (HSTS, X-Frame-Options, etc.)
- SSL/TLS encryption
- Separate network for containers

## Performance

- Gzip compression enabled
- Static asset caching
- Next.js optimized production build
- HTTP/2 support (when SSL enabled)

## Support

For issues or questions, refer to:
- Next.js docs: https://nextjs.org/docs
- Docker docs: https://docs.docker.com
- Nginx docs: https://nginx.org/en/docs
