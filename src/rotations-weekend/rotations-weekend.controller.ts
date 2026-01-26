import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RotationsWeekendService } from './rotations-weekend.service';
import { Roles, CurrentUser } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';
import { PaginationDto } from '../common/dto';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('rotations-weekend')
@ApiBearerAuth('JWT-auth')
@Controller('rotations-weekend')
export class RotationsWeekendController {
  constructor(private readonly rotationsService: RotationsWeekendService) {}

  @Get()
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Lister les rotations' })
  findAll(
    @Query() pagination: PaginationDto,
    @Query('annee') annee?: string,
    @Query('responsableId') responsableId?: string,
    @Query('status') status?: string,
  ) {
    return this.rotationsService.findAll(pagination, { annee, responsableId, status });
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Obtenir une rotation' })
  findOne(@Param('id') id: string) {
    return this.rotationsService.findOne(id);
  }

  @Post('generate')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Générer les rotations' })
  generateRotations(
    @Body('nbSemaines') nbSemaines: number = 12,
    @Body('dateDebut') dateDebut?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    return this.rotationsService.generateRotations(
      nbSemaines,
      dateDebut ? new Date(dateDebut) : undefined,
      user?.id,
      user?.name,
    );
  }

  @Post(':id/absence')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Déclarer une absence' })
  declareAbsence(
    @Param('id') id: string,
    @Body('raison') raison: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.rotationsService.declareAbsence(id, raison, user.id, user.name);
  }

  @Post(':id/terminer')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Terminer une rotation' })
  terminerRotation(
    @Param('id') id: string,
    @Body() rapportData?: any,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    return this.rotationsService.terminerRotation(id, rapportData, user?.id, user?.name);
  }
}
