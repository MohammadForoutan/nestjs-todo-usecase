import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  constructor(private configService: ConfigService) {}

  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir =
      this.configService.get<string>('BACKUP_DIR') || './backups';
    const backupFileName = `example-backup-${timestamp}.tar.gz`;
    const backupPath = path.join(backupDir, backupFileName);

    try {
      // Ensure backup directory exists
      await fs.mkdir(backupDir, { recursive: true });

      // Get MongoDB URI
      const mongoUri = this.configService.get<string>('database.uri');
      if (!mongoUri) {
        throw new Error('MongoDB URI not configured');
      }

      // Extract database name from URI
      const dbName = this.extractDatabaseName(mongoUri);

      // Create MongoDB dump
      const dumpCommand = `mongodump --uri="${mongoUri}" --archive="${backupPath}" --gzip`;

      this.logger.log(`Creating backup: ${backupFileName}`);
      await execAsync(dumpCommand);

      this.logger.log(`Backup created successfully: ${backupPath}`);
      return backupPath;
    } catch (error) {
      this.logger.error(`Backup failed: ${error.message}`);
      throw error;
    }
  }

  async restoreBackup(backupPath: string): Promise<void> {
    try {
      const mongoUri = this.configService.get<string>('database.uri');
      if (!mongoUri) {
        throw new Error('MongoDB URI not configured');
      }

      // Check if backup file exists
      await fs.access(backupPath);

      // Restore from backup
      const restoreCommand = `mongorestore --uri="${mongoUri}" --archive="${backupPath}" --gzip --drop`;

      this.logger.log(`Restoring from backup: ${backupPath}`);
      await execAsync(restoreCommand);

      this.logger.log('Backup restored successfully');
    } catch (error) {
      this.logger.error(`Restore failed: ${error.message}`);
      throw error;
    }
  }

  async listBackups(): Promise<string[]> {
    const backupDir =
      this.configService.get<string>('BACKUP_DIR') || './backups';

    try {
      const files = await fs.readdir(backupDir);
      return files
        .filter(
          (file) =>
            file.startsWith('example-backup-') && file.endsWith('.tar.gz'),
        )
        .sort()
        .reverse(); // Most recent first
    } catch (error) {
      this.logger.error(`Failed to list backups: ${error.message}`);
      return [];
    }
  }

  async deleteOldBackups(keepCount: number = 10): Promise<void> {
    const backups = await this.listBackups();

    if (backups.length <= keepCount) {
      return;
    }

    const backupsToDelete = backups.slice(keepCount);
    const backupDir =
      this.configService.get<string>('BACKUP_DIR') || './backups';

    for (const backup of backupsToDelete) {
      try {
        await fs.unlink(path.join(backupDir, backup));
        this.logger.log(`Deleted old backup: ${backup}`);
      } catch (error) {
        this.logger.error(
          `Failed to delete backup ${backup}: ${error.message}`,
        );
      }
    }
  }

  async scheduleBackup(): Promise<void> {
    try {
      await this.createBackup();
      await this.deleteOldBackups();
    } catch (error) {
      this.logger.error(`Scheduled backup failed: ${error.message}`);
    }
  }

  private extractDatabaseName(uri: string): string {
    const match = uri.match(/\/([^/?]+)(\?|$)/);
    return match ? match[1] : 'example';
  }
}
