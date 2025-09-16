# Docker Setup

This directory contains all Docker-related configuration files for the Example Todo Management System. The setup provides different environments for development, production, testing, and monitoring.

## 📁 Directory Structure

```
docker/
├── README.md                           # This file
├── docker-compose.dev.yml              # Development environment
├── docker-compose.prod.yml             # Production environment
├── docker-compose.test.yml             # E2E testing environment
├── docker-compose.unit-test.yml        # Unit testing environment
├── docker-compose.ci.yml               # CI/CD testing environment
└── docker-compose.monitoring.yml       # Monitoring stack (Prometheus + Grafana)
```

## 🚀 Quick Start

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Node.js 18+ (for local development)
- pnpm (for local development)

### Environment Setup

1. **Copy environment file:**

   ```bash
   cp env.example .env
   ```

2. **Update environment variables in `.env`:**

   ```bash
   # Database
   MONGODB_URI=mongodb://localhost:27017/example

   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=24h

   # Application
   NODE_ENV=development
   PORT=3000
   ```

## 🛠️ Available Commands

### Development

```bash
# Start development environment
pnpm run docker:dev

# View development logs
pnpm run docker:logs

# Stop development environment
pnpm run docker:stop
```

### Production

```bash
# Start production environment
pnpm run docker:prod

# Stop production environment
pnpm run docker:stop
```

### Testing

```bash
# Run E2E tests
pnpm run docker:test

# Run unit tests
pnpm run docker:test-unit

# Run CI tests with coverage
pnpm run docker:test-ci
```

### Monitoring

```bash
# Start monitoring stack (Prometheus + Grafana)
pnpm run docker:monitoring

# Access Grafana: http://localhost:3001
# Access Prometheus: http://localhost:9090
```

### Maintenance

```bash
# Clean up all containers and volumes
pnpm run docker:clean

# Stop all environments
pnpm run docker:stop
```

## 📋 Environment Details

### Development Environment (`docker-compose.dev.yml`)

- **Application**: NestJS app with hot reload
- **Database**: MongoDB with persistent volume
- **Ports**:
  - App: `http://localhost:3000`
  - MongoDB: `mongodb://localhost:27017`
  - API Docs: `http://localhost:3000/api`

**Features:**

- Hot reload for development
- Persistent data storage
- Debug logging enabled
- Swagger documentation

### Production Environment (`docker-compose.prod.yml`)

- **Application**: Optimized NestJS app
- **Database**: MongoDB with persistent volume
- **Ports**:
  - App: `http://localhost:3000`
  - MongoDB: `mongodb://localhost:27017`

**Features:**

- Multi-stage build for optimization
- Production-ready configuration
- Health checks
- Resource limits

### Testing Environments

#### E2E Tests (`docker-compose.test.yml`)

- **Application**: Test NestJS app
- **Database**: MongoDB in-memory for testing
- **Purpose**: End-to-end integration testing

#### Unit Tests (`docker-compose.unit-test.yml`)

- **Application**: Test NestJS app
- **Database**: Not required (mocked)
- **Purpose**: Unit testing with Jest

#### CI Tests (`docker-compose.ci.yml`)

- **Application**: Test NestJS app with coverage
- **Database**: MongoDB in-memory
- **Purpose**: Continuous Integration testing

### Monitoring Environment (`docker-compose.monitoring.yml`)

- **Prometheus**: Metrics collection and storage
- **Grafana**: Metrics visualization and dashboards
- **Ports**:
  - Prometheus: `http://localhost:9090`
  - Grafana: `http://localhost:3001`

## 🔧 Configuration

### Environment Variables

| Variable         | Description               | Default                         | Required |
| ---------------- | ------------------------- | ------------------------------- | -------- |
| `NODE_ENV`       | Environment mode          | `development`                   | Yes      |
| `PORT`           | Application port          | `3000`                          | No       |
| `MONGODB_URI`    | MongoDB connection string | `mongodb://mongo:27017/example` | Yes      |
| `JWT_SECRET`     | JWT signing secret        | -                               | Yes      |
| `JWT_EXPIRES_IN` | JWT expiration time       | `24h`                           | No       |
| `LOG_LEVEL`      | Logging level             | `info`                          | No       |

### Docker Compose Overrides

You can create override files for custom configurations:

```bash
# Create custom development override
cp docker-compose.dev.yml docker-compose.override.yml

# Use with docker compose
docker compose -f docker/docker-compose.dev.yml -f docker-compose.override.yml up
```

## 📊 Monitoring

### Prometheus Metrics

The application exposes metrics at `/metrics`:

- HTTP request metrics
- Database connection metrics
- Application performance metrics
- Custom business metrics

### Grafana Dashboards

Pre-configured dashboards include:

- Application Overview
- Database Performance
- HTTP Request Metrics
- System Resources

### Accessing Monitoring

1. **Start monitoring:**

   ```bash
   pnpm run docker:monitoring
   ```

2. **Access Grafana:**
   - URL: `http://localhost:3001`
   - Username: `admin`
   - Password: `admin`

3. **Access Prometheus:**
   - URL: `http://localhost:9090`

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm run docker:dev
```

#### Database Connection Issues

```bash
# Check MongoDB container
docker ps | grep mongo

# View MongoDB logs
docker logs example-mongo-1

# Restart database
docker restart example-mongo-1
```

#### Container Build Issues

```bash
# Clean build cache
docker builder prune

# Rebuild without cache
pnpm run docker:dev --no-cache
```

#### Permission Issues

```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Rebuild containers
pnpm run docker:clean
pnpm run docker:dev
```

### Logs and Debugging

#### View Application Logs

```bash
# Development logs
pnpm run docker:logs

# All container logs
docker compose -f docker/docker-compose.dev.yml logs

# Specific service logs
docker compose -f docker/docker-compose.dev.yml logs app
docker compose -f docker/docker-compose.dev.yml logs mongo
```

#### Debug Mode

```bash
# Start with debug logging
LOG_LEVEL=debug pnpm run docker:dev

# Access container shell
docker exec -it example-app-1 sh
```

## 🔒 Security

### Production Security

1. **Use strong secrets:**

   ```bash
   # Generate strong JWT secret
   openssl rand -base64 32
   ```

2. **Enable HTTPS:**
   - Configure reverse proxy (nginx)
   - Use SSL certificates
   - Update CORS settings

3. **Database Security:**
   - Use authentication
   - Enable SSL connections
   - Restrict network access

4. **Container Security:**
   - Run as non-root user
   - Use minimal base images
   - Regular security updates

### Development Security

- Use `.env` files for secrets
- Never commit secrets to version control
- Use different secrets for each environment
- Regular dependency updates

## 📈 Performance

### Optimization Tips

1. **Multi-stage builds** for smaller images
2. **Layer caching** for faster builds
3. **Resource limits** to prevent resource exhaustion
4. **Health checks** for better reliability
5. **Persistent volumes** for data durability

### Resource Limits

```yaml
# Example resource limits
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## 🤝 Contributing

### Adding New Services

1. Create new compose file: `docker-compose.new-service.yml`
2. Add script to `package.json`
3. Update this README
4. Test thoroughly

### Modifying Existing Services

1. Update the relevant compose file
2. Test in development first
3. Update documentation
4. Consider backward compatibility

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Docker Guide](https://docs.nestjs.com/recipes/docker)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

## 🆘 Support

For issues and questions:

1. Check this README first
2. Review Docker logs
3. Check GitHub issues
4. Create new issue with:
   - Docker version
   - Compose file used
   - Error logs
   - Steps to reproduce
