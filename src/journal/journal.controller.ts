import { Controller, Get, Query, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JournalService } from './journal.service';
import { Roles } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';
import { QueryJournalDto } from './dto';

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin/logs')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtenir le journal d\'activités avec filtres et pagination' })
  @ApiResponse({ status: 200, description: 'Liste des logs avec pagination' })
  findAll(@Query() query: QueryJournalDto) {
    return this.journalService.findAll(query);
  }

  @Get('stats')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtenir les statistiques du journal d\'activités' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Date de début (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Date de fin (ISO 8601)' })
  @ApiResponse({ status: 200, description: 'Statistiques des activités' })
  getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.journalService.getStats(startDate, endDate);
  }

  @Get('entites')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtenir la liste des entités journalisées' })
  @ApiResponse({ status: 200, description: 'Liste des entités distinctes' })
  getEntites() {
    return this.journalService.getEntites();
  }

  @Get('entite/:entite/:entiteId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtenir l\'historique des modifications d\'une entité spécifique' })
  @ApiParam({ name: 'entite', description: 'Type de l\'entité (ex: User, Professeur, Cours)' })
  @ApiParam({ name: 'entiteId', description: 'ID de l\'entité' })
  @ApiResponse({ status: 200, description: 'Historique des modifications de l\'entité' })
  getLogsByEntite(
    @Param('entite') entite: string,
    @Param('entiteId') entiteId: string,
  ) {
    return this.journalService.getLogsByEntite(entite, entiteId);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtenir un log spécifique par son ID' })
  @ApiParam({ name: 'id', description: 'ID du log' })
  @ApiResponse({ status: 200, description: 'Détails du log' })
  @ApiResponse({ status: 404, description: 'Log non trouvé' })
  findOne(@Param('id') id: string) {
    return this.journalService.findOne(id);
  }

  @Delete('cleanup')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer les anciens logs (archivage)' })
  @ApiQuery({ name: 'daysToKeep', required: false, description: 'Nombre de jours à conserver (défaut: 90)' })
  @ApiResponse({ status: 200, description: 'Nombre de logs supprimés' })
  deleteOldLogs(@Query('daysToKeep') daysToKeep?: number) {
    return this.journalService.deleteOldLogs(daysToKeep ? Number(daysToKeep) : undefined);
  }
}
