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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IndicateursAcademiquesService } from './indicateurs-academiques.service';
import { CreateIndicateurAcademiqueDto } from './dto/create-indicateur-academique.dto';
import { UpdateIndicateurAcademiqueDto } from './dto/update-indicateur-academique.dto';
import { Roles } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';

@ApiTags('indicateurs-academiques')
@ApiBearerAuth('JWT-auth')
@Controller('indicateurs-academiques')
export class IndicateursAcademiquesController {
  constructor(private readonly indicateursService: IndicateursAcademiquesService) {}

  @Get()
  @Roles(Role.ADMIN, Role.COORDINATOR, Role.TEACHER)
  @ApiOperation({ summary: 'Lister tous les indicateurs académiques' })
  @ApiQuery({ name: 'programmeId', required: false, description: 'Filtrer par programme' })
  @ApiQuery({ name: 'periodeId', required: false, description: 'Filtrer par période académique' })
  findAll(
    @Query('programmeId') programmeId?: string,
    @Query('periodeId') periodeId?: string,
  ) {
    return this.indicateursService.findAll(programmeId, periodeId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Obtenir un indicateur académique' })
  findOne(@Param('id') id: string) {
    return this.indicateursService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Créer un indicateur académique' })
  create(@Body() data: CreateIndicateurAcademiqueDto) {
    return this.indicateursService.create(data);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Mettre à jour un indicateur académique' })
  update(@Param('id') id: string, @Body() data: UpdateIndicateurAcademiqueDto) {
    return this.indicateursService.update(id, data);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Mettre à jour partiellement un indicateur académique' })
  partialUpdate(@Param('id') id: string, @Body() data: UpdateIndicateurAcademiqueDto) {
    return this.indicateursService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Supprimer un indicateur académique' })
  remove(@Param('id') id: string) {
    return this.indicateursService.remove(id);
  }
}
