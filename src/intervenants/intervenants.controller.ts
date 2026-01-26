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
import { IntervenantsService } from './intervenants.service';
import { Roles, CurrentUser } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';
import { PaginationDto } from '../common/dto';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('intervenants')
@ApiBearerAuth('JWT-auth')
@Controller('intervenants')
export class IntervenantsController {
  constructor(private readonly intervenantsService: IntervenantsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Lister tous les intervenants' })
  findAll(@Query() pagination: PaginationDto) {
    return this.intervenantsService.findAll(pagination);
  }

  @Get('mes-seances')
  @ApiOperation({ summary: 'Obtenir mes séances (pour intervenant)' })
  getMesSeances(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.intervenantsService.getMesSeances(user.email, { status, startDate, endDate });
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Obtenir un intervenant' })
  findOne(@Param('id') id: string) {
    return this.intervenantsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Créer un intervenant' })
  create(@Body() data: any, @CurrentUser() user: AuthenticatedUser) {
    return this.intervenantsService.create(data, user.id, user.name);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Mettre à jour un intervenant' })
  update(@Param('id') id: string, @Body() data: any, @CurrentUser() user: AuthenticatedUser) {
    return this.intervenantsService.update(id, data, user.id, user.name);
  }

  @Patch(':id/disponibilite')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Mettre à jour la disponibilité' })
  updateDisponibilite(
    @Param('id') id: string,
    @Body('disponible') disponible: boolean,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.intervenantsService.updateDisponibilite(id, disponible, user.id, user.name);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Supprimer un intervenant' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.intervenantsService.remove(id, user.id, user.name);
  }
}
