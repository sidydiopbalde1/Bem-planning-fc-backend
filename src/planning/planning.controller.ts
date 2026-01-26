import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlanningService } from './planning.service';
import { Roles, CurrentUser } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('planning')
@ApiBearerAuth('JWT-auth')
@Controller('planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Get('schedule')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Obtenir des suggestions de créneaux' })
  getSuggestedSlots(
    @Query('moduleId') moduleId?: string,
    @Query('intervenantId') intervenantId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('duree') duree?: number,
    @Query('limit') limit?: number,
  ) {
    return this.planningService.getSuggestedSlots({
      moduleId,
      intervenantId,
      startDate: startDate || new Date().toISOString(),
      endDate,
      duree,
      limit,
    });
  }

  @Post('schedule')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Générer un planning automatique' })
  generateAutoPlanning(@Body() data: any, @CurrentUser() user: AuthenticatedUser) {
    return this.planningService.generateAutoPlanning(data, user.id, user.name);
  }
}
