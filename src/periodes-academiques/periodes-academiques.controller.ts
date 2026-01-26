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
import { PeriodesAcademiquesService } from './periodes-academiques.service';
import { Roles, CurrentUser } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';
import { PaginationDto } from '../common/dto';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('periodes-academiques')
@ApiBearerAuth('JWT-auth')
@Controller('periodes-academiques')
export class PeriodesAcademiquesController {
  constructor(private readonly periodesService: PeriodesAcademiquesService) {}

  @Get()
  @Roles(Role.ADMIN, Role.COORDINATOR, Role.TEACHER)
  @ApiOperation({ summary: 'Lister toutes les périodes académiques' })
  findAll(@Query() pagination: PaginationDto, @Query('active') active?: string) {
    return this.periodesService.findAll(pagination, active == 'true');
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Obtenir une période académique' })
  findOne(@Param('id') id: string) {
    return this.periodesService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Créer une période académique' })
  create(@Body() data: any, @CurrentUser() user: AuthenticatedUser) {
    return this.periodesService.create(data, user.id, user.name);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mettre à jour une période académique' })
  update(@Param('id') id: string, @Body() data: any, @CurrentUser() user: AuthenticatedUser) {
    return this.periodesService.update(id, data, user.id, user.name);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer une période académique' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.periodesService.remove(id, user.id, user.name);
  }
}
