import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total, unread] = await Promise.all([
      this.prisma.notification.findMany({
        where: { destinataireId: userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where: { destinataireId: userId } }),
      this.prisma.notification.count({ where: { destinataireId: userId, lu: false } }),
    ]);

    return {
      notifications,
      unread,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      stats: { total, unread }
    };
  }

  async create(data: {
    titre: string;
    message: string;
    type: string;
    priorite?: string;
    destinataireId: string;
    lienAction?: string;
  }) {
    return this.prisma.notification.create({
      data: {
        titre: data.titre,
        message: data.message,
        type: data.type as any,
        priorite: (data.priorite || 'NORMALE') as any,
        destinataireId: data.destinataireId,
        lienAction: data.lienAction,
      },
    });
  }

  async markAsRead(ids: string[], userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        id: { in: ids },
        destinataireId: userId,
      },
      data: { lu: true },
    });

    return { count: result.count };
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { destinataireId: userId, lu: false },
      data: { lu: true },
    });

    return { count: result.count };
  }

  async delete(id: string, userId: string) {
    await this.prisma.notification.deleteMany({
      where: { id, destinataireId: userId },
    });

    return { message: 'Notification supprimée' };
  }
}
