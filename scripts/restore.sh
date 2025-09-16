#!/bin/bash

# Example Database Restore Script
# Usage: ./scripts/restore.sh <backup_file>

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
MONGODB_URI="${MONGODB_URI:-mongodb://localhost:27017/example}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backup file is provided
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: Please provide backup file name${NC}"
    echo "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -la "$BACKUP_DIR"/example-backup-*.tar.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"

# If backup file doesn't have full path, assume it's in backup directory
if [[ "$BACKUP_FILE" != /* ]]; then
    BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}Starting Example database restore...${NC}"

# Check if MongoDB is accessible
echo -e "${YELLOW}Checking MongoDB connection...${NC}"
if ! mongosh --eval "db.adminCommand('ping')" "$MONGODB_URI" > /dev/null 2>&1; then
    echo -e "${RED}Error: Cannot connect to MongoDB at $MONGODB_URI${NC}"
    exit 1
fi

# Confirm restore
echo -e "${YELLOW}WARNING: This will replace all data in the database!${NC}"
echo -e "${YELLOW}Backup file: $BACKUP_FILE${NC}"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Restore cancelled.${NC}"
    exit 0
fi

# Restore backup
echo -e "${YELLOW}Restoring from backup: $BACKUP_FILE${NC}"
mongorestore --uri="$MONGODB_URI" --archive="$BACKUP_FILE" --gzip --drop

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Database restored successfully from: $BACKUP_FILE${NC}"
else
    echo -e "${RED}Restore failed!${NC}"
    exit 1
fi
