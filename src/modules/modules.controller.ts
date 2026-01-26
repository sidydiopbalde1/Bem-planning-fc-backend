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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { Roles, CurrentUser } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';
import { PaginationDto } from '../common/dto';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('modules')
@ApiBearerAuth('JWT-auth')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Lister tous les modules' })
  @ApiQuery({ name: 'programmeId', required: false })
  @ApiQuery({ name: 'intervenantId', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query() pagination: PaginationDto,
    @Query('programmeId') programmeId?: string,
    @Query('intervenantId') intervenantId?: string,
    @Query('status') status?: string,
  ) {
    return this.modulesService.findAll(pagination, { programmeId, intervenantId, status });
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Obtenir un module' })
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Créer un module' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() data: any) {
    return this.modulesService.create(data, user.id, user.name);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Mettre à jour un module' })
  update(@Param('id') id: string, @Body() data: any, @CurrentUser() user: AuthenticatedUser) {
    return this.modulesService.update(id, data, user.id, user.name);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Supprimer un module' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.modulesService.remove(id, user.id, user.name);
  }
}
