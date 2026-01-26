import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SeancesService } from './seances.service';
import { Roles, CurrentUser } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';
import { PaginationDto } from '../common/dto';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('seances')
@ApiBearerAuth('JWT-auth')
@Controller('seances')
export class SeancesController {
  constructor(private readonly seancesService: SeancesService) {}

  @Get()
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Lister toutes les séances' })
  findAll(
    @Query() pagination: PaginationDto,
    @Query('programmeId') programmeId?: string,
    @Query('moduleId') moduleId?: string,
    @Query('intervenantId') intervenantId?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.seancesService.findAll(pagination, {
      programmeId,
      moduleId,
      intervenantId,
      status,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une séance' })
  findOne(@Param('id') id: string) {
    return this.seancesService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Créer une séance' })
  create(@Body() data: any, @CurrentUser() user: AuthenticatedUser) {
    return this.seancesService.create(data, user.id, user.name);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Mettre à jour une séance' })
  update(@Param('id') id: string, @Body() data: any, @CurrentUser() user: AuthenticatedUser) {
    return this.seancesService.update(id, data, user.id, user.name);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Marquer une séance comme terminée' })
  complete(
    @Param('id') id: string,
    @Body() data: { notes?: string; realDuration?: number },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.seancesService.complete(id, data, user.id, user.name);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Supprimer une séance' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.seancesService.remove(id, user.id, user.name);
  }
}
