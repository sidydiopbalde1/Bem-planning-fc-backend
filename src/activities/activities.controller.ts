import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('activities')
@ApiBearerAuth('JWT-auth')
@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('recent')
  @ApiOperation({ summary: 'Obtenir les activités récentes pour le dashboard' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre d\'activités à retourner (max 50)' })
  getRecentActivities(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.activitiesService.getRecentActivities(limitNum);
  }
}
