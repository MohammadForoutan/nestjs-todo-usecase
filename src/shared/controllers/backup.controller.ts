import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BackupService } from '../services/backup.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../modules/user/domain/user.entity';

@ApiTags('Backup')
@Controller({
  path: 'backup',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new backup' })
  @ApiResponse({ status: 201, description: 'Backup created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async createBackup() {
    const backupPath = await this.backupService.createBackup();
    return {
      message: 'Backup created successfully',
      backupPath,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('list')
  @ApiOperation({ summary: 'List all available backups' })
  @ApiResponse({ status: 200, description: 'Backups listed successfully' })
  async listBackups() {
    const backups = await this.backupService.listBackups();
    return {
      backups,
      count: backups.length,
    };
  }

  @Post('restore/:filename')
  @ApiOperation({ summary: 'Restore from a specific backup' })
  @ApiResponse({ status: 200, description: 'Backup restored successfully' })
  @ApiResponse({ status: 404, description: 'Backup file not found' })
  async restoreBackup(@Param('filename') filename: string) {
    const backupDir = process.env.BACKUP_DIR || './backups';
    const backupPath = `${backupDir}/${filename}`;

    await this.backupService.restoreBackup(backupPath);
    return {
      message: 'Backup restored successfully',
      backupFile: filename,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete('cleanup')
  @ApiOperation({ summary: 'Clean up old backups (keep last 10)' })
  @ApiResponse({
    status: 200,
    description: 'Old backups cleaned up successfully',
  })
  async cleanupBackups() {
    await this.backupService.deleteOldBackups();
    return {
      message: 'Old backups cleaned up successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
