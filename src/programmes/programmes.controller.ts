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
import { ProgrammesService } from './programmes.service';
import { Roles, CurrentUser } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';
import { PaginationDto } from '../common/dto';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('programmes')
@ApiBearerAuth('JWT-auth')
@Controller('programmes')
export class ProgrammesController {
  constructor(private readonly programmesService: ProgrammesService) {}

  @Get()
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Lister tous les programmes' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() pagination: PaginationDto,
    @Query('status') status?: string,
    @Query('semestre') semestre?: string,
  ) {
    return this.programmesService.findAll(user.id, user.role, pagination, { status, semestre });
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Obtenir un programme' })
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.programmesService.findOne(id, user.id, user.role);
  }

  @Post()
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Créer un programme' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() data: any) {
    return this.programmesService.create(data, user.id, user.name);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Mettre à jour un programme' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.programmesService.update(id, data, user.id, user.role, user.name);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @ApiOperation({ summary: 'Supprimer un programme' })
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.programmesService.remove(id, user.id, user.role, user.name);
  }
}
