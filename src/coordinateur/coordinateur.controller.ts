import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CoordinateurService } from './coordinateur.service';
import { Roles, CurrentUser } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('coordinateur')
@ApiBearerAuth('JWT-auth')
@Controller('coordinateur')
export class CoordinateurController {
  constructor(private readonly coordinateurService: CoordinateurService) {}

  @Get('programmes')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Obtenir les programmes du coordinateur' })
  getProgrammes(
    @CurrentUser() user: AuthenticatedUser,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('semestre') semestre?: string,
  ) {
    return this.coordinateurService.getProgrammes(user.id, user.role, { search, status, semestre });
  }

  @Get('modules')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Obtenir les modules du coordinateur' })
  getModules(
    @CurrentUser() user: AuthenticatedUser,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('programmeId') programmeId?: string,
  ) {
    return this.coordinateurService.getModules(user.id, user.role, { search, status, programmeId });
  }

  @Get('dashboard')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Obtenir le dashboard coordinateur' })
  getDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.coordinateurService.getDashboard(user.id, user.role);
  }

  @Get('alerts')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Vérifier les alertes' })
  checkAlerts(@CurrentUser() user: AuthenticatedUser) {
    return this.coordinateurService.checkAlerts(user.id, user.role);
  }

  @Post('alerts/check')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Déclencher une vérification des alertes' })
  triggerAlertCheck(@CurrentUser() user: AuthenticatedUser) {
    return this.coordinateurService.checkAlerts(user.id, user.role);
  }
}
