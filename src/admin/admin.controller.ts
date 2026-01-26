import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats/dashboard')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Statistiques globales admin' })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('stats/intervenants')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Statistiques intervenants' })
  getIntervenantsStats() {
    return this.adminService.getIntervenantsStats();
  }
}
