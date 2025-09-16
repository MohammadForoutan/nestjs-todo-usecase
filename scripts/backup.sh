#!/bin/bash

# Example Database Backup Script
# Usage: ./scripts/backup.sh [backup_name]

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
MONGODB_URI="${MONGODB_URI:-mongodb://localhost:27017/example}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="${1:-example-backup-${TIMESTAMP}}"
BACKUP_FILE="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Example database backup...${NC}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if MongoDB is accessible
echo -e "${YELLOW}Checking MongoDB connection...${NC}"
if ! mongosh --eval "db.adminCommand('ping')" "$MONGODB_URI" > /dev/null 2>&1; then
    echo -e "${RED}Error: Cannot connect to MongoDB at $MONGODB_URI${NC}"
    exit 1
fi

# Create backup
echo -e "${YELLOW}Creating backup: $BACKUP_FILE${NC}"
mongodump --uri="$MONGODB_URI" --archive="$BACKUP_FILE" --gzip

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Backup created successfully: $BACKUP_FILE${NC}"

    # Get backup size
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}Backup size: $BACKUP_SIZE${NC}"

    # Clean up old backups (keep last 10)
    echo -e "${YELLOW}Cleaning up old backups...${NC}"
    cd "$BACKUP_DIR"
    ls -t example-backup-*.tar.gz | tail -n +11 | xargs -r rm -f
    cd - > /dev/null

    echo -e "${GREEN}Backup process completed successfully!${NC}"
else
    echo -e "${RED}Backup failed!${NC}"
    exit 1
fi
