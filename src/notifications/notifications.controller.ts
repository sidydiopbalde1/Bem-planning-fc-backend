import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../common/decorators';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

@Get()
@ApiOperation({ summary: 'Obtenir mes notifications' })
findAll(
  @CurrentUser() user: AuthenticatedUser,
  @Query('page') page = 1,
  @Query('limit') limit = 10,
  @Query('lu') lu?: string,
) {
  return this.notificationsService.findByUser(
    user.id,
    Number(page),
    Number(limit),
    lu !== undefined ? lu === 'true' : undefined,
  );
}

  @Post('mark-read')
  @ApiOperation({ summary: 'Marquer des notifications comme lues' })
  markAsRead(
    @CurrentUser() user: AuthenticatedUser,
    @Body('ids') ids: string[],
  ) {
    return this.notificationsService.markAsRead(ids, user.id);
  }

  @Post('mark-all-read')
  @ApiOperation({ summary: 'Marquer toutes les notifications comme lues' })
  markAllAsRead(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une notification' })
  delete(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.notificationsService.delete(id, user.id);
  }
}
