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
import { SallesService } from './salles.service';
import { Roles, CurrentUser } from '../common/decorators';
import { Role } from '../common/constants/roles.constant';
import { PaginationDto } from '../common/dto';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('salles')
@ApiBearerAuth('JWT-auth')
@Controller('admin/salles')
export class SallesController {
  constructor(private readonly sallesService: SallesService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lister toutes les salles' })
  findAll(@Query() pagination: PaginationDto) {
    return this.sallesService.findAll(pagination);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtenir une salle' })
  findOne(@Param('id') id: string) {
    return this.sallesService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Créer une salle' })
  create(@Body() data: any, @CurrentUser() user: AuthenticatedUser) {
    return this.sallesService.create(data, user.id, user.name);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mettre à jour une salle' })
  update(@Param('id') id: string, @Body() data: any, @CurrentUser() user: AuthenticatedUser) {
    return this.sallesService.update(id, data, user.id, user.name);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer une salle' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.sallesService.remove(id, user.id, user.name);
  }
}
