import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { Roles, CurrentUser } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('statistics')
@ApiBearerAuth('JWT-auth')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Obtenir les statistiques' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['global', 'intervenants', 'programmes', 'planning', 'performance'],
    description: 'Type de statistiques à récupérer',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Date de début (format ISO)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Date de fin (format ISO)',
  })
  async getStatistics(
    @CurrentUser() user: AuthenticatedUser,
    @Query('type') type: string = 'global',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    switch (type) {
      case 'global':
        return this.statisticsService.getGlobalStatistics(user.id, user.role);

      case 'intervenants':
        return this.statisticsService.getIntervenantsStatistics(
          user.id,
          user.role,
          startDate,
          endDate,
        );

      case 'programmes':
        return this.statisticsService.getProgrammesStatistics(
          user.id,
          user.role,
        );

      case 'planning':
        return this.statisticsService.getPlanningStatistics(
          user.id,
          user.role,
          startDate,
          endDate,
        );

      case 'performance':
        return this.statisticsService.getPerformanceIndicators(
          user.id,
          user.role,
        );

      default:
        return this.statisticsService.getGlobalStatistics(user.id, user.role);
    }
  }

  @Get('global')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Statistiques globales du système' })
  async getGlobalStatistics(@CurrentUser() user: AuthenticatedUser) {
    return this.statisticsService.getGlobalStatistics(user.id, user.role);
  }

  @Get('intervenants')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Statistiques par intervenant' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getIntervenantsStatistics(
    @CurrentUser() user: AuthenticatedUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.statisticsService.getIntervenantsStatistics(
      user.id,
      user.role,
      startDate,
      endDate,
    );
  }

  @Get('programmes')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Statistiques par programme' })
  async getProgrammesStatistics(@CurrentUser() user: AuthenticatedUser) {
    return this.statisticsService.getProgrammesStatistics(user.id, user.role);
  }

  @Get('planning')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Statistiques de planning' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getPlanningStatistics(
    @CurrentUser() user: AuthenticatedUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.statisticsService.getPlanningStatistics(
      user.id,
      user.role,
      startDate,
      endDate,
    );
  }

  @Get('performance')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Indicateurs de performance (KPI)' })
  async getPerformanceIndicators(@CurrentUser() user: AuthenticatedUser) {
    return this.statisticsService.getPerformanceIndicators(user.id, user.role);
  }
}
