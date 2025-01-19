# Deployment Guide

## Prerequisites

- Docker and Docker Compose
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Redis
- OpenAI API key

## Environment Setup

1. Create environment variables file:
```bash
cp .env.example .env
```

2. Configure the following variables in `.env`:
```env
# Server Configuration
PORT=4000
NODE_ENV=production

# Database Configuration
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=omnilearn
DB_PASSWORD=your_db_password
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Redis Configuration
REDIS_URL=redis://localhost:6379
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Start development client:
```bash
cd frontend
npm install
npm start
```

## Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. For production deployment:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

## Database Setup

1. Create database:
```sql
CREATE DATABASE omnilearn;
```

2. Run migrations:
```bash
npm run migrate:up
```

3. Seed initial data:
```bash
npm run seed
```

## SSL Configuration

1. Generate SSL certificate:
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout private.key -out certificate.crt
```

2. Configure Nginx:
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring Setup

1. Install PM2:
```bash
npm install -g pm2
```

2. Start with PM2:
```bash
pm2 start npm --name "omnilearn" -- start
```

3. Monitor logs:
```bash
pm2 logs omnilearn
```

## Backup Configuration

1. Database backup:
```bash
pg_dump -U your_db_user omnilearn > backup.sql
```

2. Automated backup script:
```bash
#!/bin/bash
backup_dir="/path/to/backups"
date=$(date +%Y%m%d_%H%M%S)
pg_dump -U your_db_user omnilearn > "$backup_dir/backup_$date.sql"
```

## Security Checklist

- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Database passwords secure
- [ ] Environment variables protected
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] Security headers set
- [ ] Regular backups scheduled

## Scaling Considerations

### Horizontal Scaling
- Use load balancer
- Configure session sharing
- Set up database replication
- Implement caching strategy

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Enable compression
- Configure caching

## Troubleshooting

### Common Issues

1. Database Connection:
```bash
# Check database status
systemctl status postgresql

# Check logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

2. Server Issues:
```bash
# Check Node.js logs
pm2 logs

# Check system resources
htop
```

3. Docker Issues:
```bash
# Check container logs
docker-compose logs

# Rebuild containers
docker-compose down && docker-compose up --build
```

## Performance Optimization

1. Enable Gzip compression
2. Configure CDN
3. Implement caching strategy
4. Optimize database queries
5. Use connection pooling

## Maintenance

### Regular Tasks

1. Update dependencies:
```bash
npm update
```

2. Check logs:
```bash
pm2 logs
```

3. Monitor disk space:
```bash
df -h
```

4. Backup database:
```bash
./backup.sh
```

### Emergency Procedures

1. Rollback deployment:
```bash
git checkout previous_version
npm install
npm run build
pm2 restart omnilearn
```

2. Restore database:
```bash
psql -U your_db_user omnilearn < backup.sql
```
