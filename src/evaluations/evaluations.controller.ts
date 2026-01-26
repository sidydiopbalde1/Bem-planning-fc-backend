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
import { EvaluationsService } from './evaluations.service';
import { Roles, Public, CurrentUser } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';
import { PaginationDto } from '../common/dto';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('evaluations')
@ApiBearerAuth('JWT-auth')
@Controller('evaluations-enseignements')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Lister les évaluations' })
  findAll(
    @Query() pagination: PaginationDto,
    @Query('moduleId') moduleId?: string,
    @Query('statut') statut?: string,
  ) {
    return this.evaluationsService.findAll(pagination, { moduleId, statut });
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Obtenir une évaluation' })
  findOne(@Param('id') id: string) {
    return this.evaluationsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Créer une évaluation' })
  create(@Body() data: any, @CurrentUser() user: AuthenticatedUser) {
    return this.evaluationsService.create(data, user.id, user.name);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Mettre à jour une évaluation' })
  update(@Param('id') id: string, @Body() data: any, @CurrentUser() user: AuthenticatedUser) {
    return this.evaluationsService.update(id, data, user.id, user.name);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Supprimer une évaluation' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.evaluationsService.remove(id, user.id, user.name);
  }

  // Route publique pour soumettre une évaluation
  @Public()
  @Get('public/:lien')
  @ApiOperation({ summary: 'Obtenir une évaluation par lien (public)' })
  findByLien(@Param('lien') lien: string) {
    return this.evaluationsService.findByLien(lien);
  }

  @Public()
  @Post('public/:lien/submit')
  @ApiOperation({ summary: 'Soumettre une réponse d\'évaluation (public)' })
  submitResponse(@Param('lien') lien: string, @Body() responses: any) {
    return this.evaluationsService.submitResponse(lien, responses);
  }
}
