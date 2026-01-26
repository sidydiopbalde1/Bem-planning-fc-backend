import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryJournalDto } from './dto';
import { Stats } from 'fs';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const log = await this.prisma.journalActivite.findUnique({
      where: { id },
    });

    if (!log) {
      throw new NotFoundException(`Log avec l'ID ${id} non trouvé`);
    }

    return log;
  }

  async log(data: {
    action: string;
    entite: string;
    entiteId?: string;
    description: string;
    ancienneValeur?: any;
    nouvelleValeur?: any;
    userId?: string;
    userName?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      // entiteId and userId are required in schema, provide defaults
      return await this.prisma.journalActivite.create({
        data: {
          action: data.action as any,
          entite: data.entite,
          entiteId: data.entiteId || 'unknown',
          description: data.description,
          ancienneValeur: data.ancienneValeur ? JSON.stringify(data.ancienneValeur) : null,
          nouvelleValeur: data.nouvelleValeur ? JSON.stringify(data.nouvelleValeur) : null,
          userId: data.userId || 'system',
          userName: data.userName,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      // Ne pas faire échouer la requête si le logging échoue
      console.error('Erreur logging:', error);
    }
  }

  async findAll(filters: QueryJournalDto) {
    const { page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.action) where.action = filters.action;
    if (filters.entite) where.entite = filters.entite;
    if (filters.entiteId) where.entiteId = filters.entiteId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.userName) where.userName = { contains: filters.userName, mode: 'insensitive' };
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }
    if (filters.search) {
      where.description = { contains: filters.search, mode: 'insensitive' };
    }

    const [logs, total] = await Promise.all([
      this.prisma.journalActivite.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.journalActivite.count({ where }),
    ]);

    return {
      logs,
      stats: {
        total: total,
        last24h: await this.prisma.journalActivite.count({
          where: {
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          },
        }),
        actifusers: await this.prisma.journalActivite.groupBy({
          by: ['userId'],
          _count: { userId: true },
          orderBy: { _count: { userId: 'desc' } },
          take: 5,
        }),
        typesActions: await this.prisma.journalActivite.groupBy({
          by: ['action'],
          _count: { action: true },
          orderBy: { _count: { action: 'desc' } },
          take: 5,
        }),
      },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getStats(startDate?: string, endDate?: string) {
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [
      totalLogs,
      actionStats,
      entiteStats,
      recentActivity,
    ] = await Promise.all([
      this.prisma.journalActivite.count({ where }),
      this.prisma.journalActivite.groupBy({
        by: ['action'],
        where,
        _count: { action: true },
        orderBy: { _count: { action: 'desc' } },
      }),
      this.prisma.journalActivite.groupBy({
        by: ['entite'],
        where,
        _count: { entite: true },
        orderBy: { _count: { entite: 'desc' } },
        take: 10,
      }),
      this.prisma.journalActivite.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          action: true,
          entite: true,
          description: true,
          userName: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      totalLogs,
      parAction: actionStats.map(s => ({ action: s.action, count: s._count.action })),
      parEntite: entiteStats.map(s => ({ entite: s.entite, count: s._count.entite })),
      activiteRecente: recentActivity,
    };
  }

  async getEntites() {
    const entites = await this.prisma.journalActivite.groupBy({
      by: ['entite'],
      _count: { entite: true },
      orderBy: { _count: { entite: 'desc' } },
    });

    return entites.map(e => e.entite);
  }

  async getLogsByEntite(entite: string, entiteId: string) {
    return this.prisma.journalActivite.findMany({
      where: { entite, entiteId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteOldLogs(daysToKeep: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.prisma.journalActivite.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    });

    return { deletedCount: result.count, cutoffDate };
  }
}
