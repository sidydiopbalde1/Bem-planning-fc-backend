import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ActivitesAcademiquesService } from './activites-academiques.service';
import { CreateActiviteAcademiqueDto } from './dto/create-activite-academique.dto';
import { UpdateActiviteAcademiqueDto } from './dto/update-activite-academique.dto';
import { Roles } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';

@ApiTags('activites-academiques')
@ApiBearerAuth('JWT-auth')
@Controller('activites-academiques')
export class ActivitesAcademiquesController {
  constructor(private readonly activitesService: ActivitesAcademiquesService) {}

  @Get()
  @Roles(Role.ADMIN, Role.COORDINATOR, Role.TEACHER)
  @ApiOperation({ summary: 'Lister toutes les activités académiques' })
  findAll(
    @Query('programmeId') programmeId?: string,
    @Query('periodeId') periodeId?: string,
  ) {
    return this.activitesService.findAll(programmeId, periodeId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Obtenir une activité académique' })
  findOne(@Param('id') id: string) {
    return this.activitesService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Créer une activité académique' })
  create(@Body() data: CreateActiviteAcademiqueDto) {
    return this.activitesService.create(data);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Mettre à jour une activité académique' })
  update(@Param('id') id: string, @Body() data: UpdateActiviteAcademiqueDto) {
    return this.activitesService.update(id, data);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Mettre à jour partiellement une activité académique' })
  partialUpdate(@Param('id') id: string, @Body() data: UpdateActiviteAcademiqueDto) {
    return this.activitesService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Supprimer une activité académique' })
  remove(@Param('id') id: string) {
    return this.activitesService.remove(id);
  }
}
