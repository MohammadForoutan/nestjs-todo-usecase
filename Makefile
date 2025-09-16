# Example Docker Management Makefile

.PHONY: help dev prod test test-unit test-ci monitoring logs clean stop build

# Default target
help:
	@echo "Example Docker Management"
	@echo "========================="
	@echo ""
	@echo "Available commands:"
	@echo "  dev         - Start development environment"
	@echo "  prod        - Start production environment"
	@echo "  test        - Run E2E tests"
	@echo "  test-unit   - Run unit tests"
	@echo "  test-ci     - Run CI tests with coverage"
	@echo "  monitoring  - Start monitoring stack (Prometheus + Grafana)"
	@echo "  logs        - View development logs"
	@echo "  clean       - Clean up all containers and volumes"
	@echo "  stop        - Stop all environments"
	@echo "  build       - Build all Docker images"
	@echo ""

# Development
dev:
	@echo "Starting development environment..."
	docker compose -f docker/docker-compose.dev.yml up --build

# Production
prod:
	@echo "Starting production environment..."
	docker compose -f docker/docker-compose.prod.yml up --build -d

# Testing
test:
	@echo "Running E2E tests..."
	docker compose -f docker/docker-compose.test.yml up --build --abort-on-container-exit

test-unit:
	@echo "Running unit tests..."
	docker compose -f docker/docker-compose.unit-test.yml up --build --abort-on-container-exit

test-ci:
	@echo "Running CI tests with coverage..."
	docker compose -f docker/docker-compose.ci.yml up --build --abort-on-container-exit

# Monitoring
monitoring:
	@echo "Starting monitoring stack..."
	docker compose -f docker/docker-compose.monitoring.yml up --build -d
	@echo "Grafana: http://localhost:3001"
	@echo "Prometheus: http://localhost:9090"

# Logs
logs:
	@echo "Viewing development logs..."
	docker compose -f docker/docker-compose.dev.yml logs -f app

# Maintenance
clean:
	@echo "Cleaning up all containers and volumes..."
	docker compose -f docker/docker-compose.dev.yml down -v
	docker compose -f docker/docker-compose.prod.yml down -v
	docker compose -f docker/docker-compose.test.yml down -v
	docker compose -f docker/docker-compose.unit-test.yml down -v
	docker compose -f docker/docker-compose.ci.yml down -v
	docker compose -f docker/docker-compose.monitoring.yml down -v
	docker system prune -f

stop:
	@echo "Stopping all environments..."
	docker compose -f docker/docker-compose.dev.yml down
	docker compose -f docker/docker-compose.prod.yml down
	docker compose -f docker/docker-compose.test.yml down
	docker compose -f docker/docker-compose.unit-test.yml down
	docker compose -f docker/docker-compose.ci.yml down
	docker compose -f docker/docker-compose.monitoring.yml down

# Build
build:
	@echo "Building all Docker images..."
	docker build -f docker/Dockerfile.dev -t example-dev .
	docker build -f docker/Dockerfile.prod -t example-prod .
	docker build -f docker/Dockerfile.test -t example-test .
